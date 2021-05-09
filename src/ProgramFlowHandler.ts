import * as fs from 'fs';

import { Note } from './Note'
import { ResponseType } from './infoTypes'

/**
 * Clase encargada de la lectura/escritura en el sistema de ficheros, gestionando los errores correspondientes
 */
export class ProgramFlowHandler {
    constructor() { }

    /**
     * Añade una nota únicamente si no existe.
     * 1. Comprueba que exista el directorio del usuario. Si no es así, lo crea.
     * 2. Almacena la nota como JSON en el fichero correspondiente
     * @param note 
     * @returns {ResponseType}  Mensaje de respuesta
     */
    addNote(note: Note): ResponseType {
        let res: ResponseType = { type: 'errcode', success: false, message: "Unknown error" };
        if (!this.checkIfFileExist(note.route)) {
            try {
                this.checkUserDirectory(note.user);
                res = { type: 'add', success: true, message: "Note Added Successfully!" };
                fs.writeFile(note.route, this.noteToJSON(note), () => { });

            } catch {
                res = { type: 'errcode', success: false, message: "Something went wrong. It was not possible to write the new note." };
                return res;
            }
        } else {
            res = { type: 'errcode', success: false, message: "This note already exist. Try modifying it or choosing another title." };
            return res;
        }
        return res;
    }

    /**
     * Modifica una nota, si existe.
     * Permite cambiar el título, cuerpo o color de la nota.
     * En caso de cambiar el título, se modifica también el nombre del fichero, facilitando su gestión.
     * @param note 
     * @param ntitle 
     * @param nbody 
     * @param ncolor 
     * @returns {ResponseType}  Mensaje de respuesta
     */
    modifyNote(note: string, ntitle: string, nbody: string, ncolor: string): ResponseType {
        let res: ResponseType = { type: 'errcode', success: false, message: "Unknown error" };
        if (this.checkIfFileExist(note)) {
            try {
                let msg = "";
                let noteToModify: Note;
                let readNote: string = fs.readFileSync(note).toString();
                noteToModify = this.JSONtoNote(readNote);
                if (ntitle !== "") {
                    msg += "You have changed the title, so the note will be removed and created with the new title.\n";
                    this.deleteNote(note);
                    noteToModify.setTitle(ntitle);
                    let filename: string = ntitle.replace(/[&\/\\#,+()$~%.'":*?<>{}!¡¿]/g, '') + '.json';
                    noteToModify.setRoute(`notes/${noteToModify.user}/${filename}`);
                    msg += "Title changed\n";
                }
                if (nbody !== "") {
                    noteToModify.setBody(nbody);
                    msg += "Body changed\n";
                }
                if (ncolor !== "") {
                    noteToModify.setColor(ncolor);
                    msg += "Color changed\n";
                }
                fs.writeFile(noteToModify.getRoute(), this.noteToJSON(noteToModify), () => { });
                msg += "Note Modified Successfully!\n";
                res = { type: 'modify', success: true, message: msg };
            } catch {
                res = { type: 'errcode', success: false, message: "Something went wrong. It was not possible to modify the note." };
            }
        } else {
            res = { type: 'errcode', success: false, message: "This note does not exist. Try another title or create that note." };
        }
        return res;
    }

    /**
     * Elimina una nota, si existe.
     * @param note 
     * @returns {ResponseType}  Mensaje de respuesta
     */
    deleteNote(note: string): ResponseType {
        let res: ResponseType = { type: 'errcode', success: false, message: "Unknown error" };
        if (this.checkIfFileExist(note)) {
            try {
                fs.unlinkSync(note);
                res = { type: 'remove', success: true, message: "Note Removed Successfully!" };
            } catch {
                res = { type: 'errcode', success: false, message: "Something went wrong. It was not possible to remove the note." };
            }
        } else {
            res = { type: 'errcode', success: false, message: "This note does not exist. Try another title or create that note." };
        }
        return res;
    }

    /**
     * Muestra todas las notas de un determinado usuario en su color correspondiente.
     * Se usa un método de lectura de directorios síncrono para evitar desorden en los ficheros u omisiones por no haber terminado la lectura.
     * @param user 
     * @returns {ResponseType}  Mensaje de respuesta
     */
    listNotes(user: string) : ResponseType{
        let res: ResponseType = { type: 'errcode', success: false, message: "Unknown error" };
        let notes: Note[] = [];
        try {
            let userfiles: string[] = [];
            userfiles = fs.readdirSync(`notes/${user}`);
            if (userfiles.length > 0) {
                userfiles.forEach(element => {
                    let data = fs.readFileSync(`notes/${user}/${element}`);
                    let noteToRead: Note = this.JSONtoNote(data.toString());
                    notes.push(noteToRead);
                });
                res = { type: 'list', success: true, message: "Note List Stored", notes: notes };
            }
            else {
                res = { type: 'errcode', success: false, message: "This user does not have any note created." };
            }
        } catch {
            res = { type: 'errcode', success: false, message: "There was an error reading this user files." };
        }
        return res;
    }

    /**
     * Genera una respuesta tras la lectura de una nota, si existe.
     * @param note 
     * @returns {ResponseType}  Mensaje de respuesta
     */
    readNote(note: string): ResponseType {
        let res: ResponseType = { type: 'errcode', success: false, message: "Unknown error" };
        if (this.checkIfFileExist(note)) {
            try {
                let data = fs.readFileSync(note);
                let noteToRead: Note = this.JSONtoNote(data.toString());
                res = { type: 'read', success: true, message: "Note successfully read!", notes: [noteToRead] };
            } catch {
                res = { type: 'errcode', success: false, message: "Something went wrong. It was not possible to read the note." };
            }
        } else {
            res = { type: 'errcode', success: false, message: "This note does not exist. Try another title or create that note." };
        }
        return res;
    }

    /**
     * Convierte una nota a formato JSON
     * @param note 
     */
    noteToJSON(note: Note): string {
        return JSON.stringify(note);
    }

    /**
     * Convierte una nota en JSON a objeto de la clase Note
     * @param jsonnote 
     */
    JSONtoNote(jsonnote: string): Note {
        let aux = JSON.parse(jsonnote);
        let note: Note = new Note(aux.title, aux.body, aux.user, aux.color, aux.route);
        return note;
    }

    /**
     * Comprueba si existe un directorio para dicho usuario. Si no es así, lo crea para poder almacenar la nota con writeFile
     * @param username Nombre del usuario que escribio la nota
     */
    checkUserDirectory(username: string) {
        let userDir: string = `notes/${username}`;
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir);
        }
    }

    /**
     * Retorna si ya existe una nota con el mismo titulo y usuario
     * @param route 
     */
    checkIfFileExist(route: string): boolean {
        if (fs.existsSync(route)) return true;
        return false;
    }
}
