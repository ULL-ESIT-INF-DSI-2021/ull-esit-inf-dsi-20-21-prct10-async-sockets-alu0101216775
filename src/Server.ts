import { ProgramFlowHandler } from './ProgramFlowHandler'
import { RequestType, ResponseType } from './infoTypes'
import { Note } from './Note'

import * as net from 'net';

export function startServer() {
    // Genera un server al recibir una conexión
    net.createServer((connection) => {
        console.log('A client has connected.');
        // Genera un nuevo flujo de trabajo
        let workflow: ProgramFlowHandler = new ProgramFlowHandler();
        let fullRequest = "", rtype = "";
        //Va almacenando la petición en una string
        connection.on('data', (dataJSON) => {
            fullRequest += dataJSON.toString();
            //Al detectar el caracter \n, emite el evento request con la petición completa
            if (fullRequest.indexOf('\n') !== -1) {
                connection.emit('request', fullRequest);
            }
        })

        //Comienza al detectar el evento request
        connection.on('request', (req) => {
            let jsonrequest: RequestType = JSON.parse(req);
            rtype = jsonrequest.type;
            //Prepara la resuesta del servidor
            let svresponse: ResponseType = { type: "errcode", success: false, message: "" };
            //Procesa los comandos recibidos
            if (rtype === 'add') {
                let note: Note = new Note(jsonrequest.title, jsonrequest.body, jsonrequest.user, jsonrequest.color, jsonrequest.route);
                svresponse = workflow.addNote(note);
            } else if (rtype === 'remove') {
                svresponse = workflow.deleteNote(jsonrequest.route!);
            } else if (rtype === 'list') {
                svresponse = workflow.listNotes(jsonrequest.user!);
            } else if (rtype === 'modify') {
                let ntitle = "", nbody = "", ncolor = "";
                if (jsonrequest.newtitle !== undefined) ntitle = jsonrequest.newtitle;
                if (jsonrequest.newbody !== undefined) nbody = jsonrequest.newbody;
                if (jsonrequest.newcolor !== undefined) ncolor = jsonrequest.newcolor;
                svresponse = workflow.modifyNote(jsonrequest.route!, ntitle, nbody, ncolor);
            } else if (rtype === 'read') {
                svresponse = workflow.readNote(jsonrequest.route!);
            }

            //Envía la respuesta completa al cliente, y cierra la conexión
            connection.write(JSON.stringify(svresponse), () => {
                connection.end();
            });
        })
        //Al cerrar la conexión con un cliente, notifica con un log en el servidor
        connection.on('close', () => {
            console.log('A client has disconnected.');
        });
        //Hasta que se deje de ejecutar el programa, el servidor permanece en escucha en el puerto 60300
    }).listen(60300, () => {
        console.log('Waiting for clients to connect.');
    });
}

startServer();