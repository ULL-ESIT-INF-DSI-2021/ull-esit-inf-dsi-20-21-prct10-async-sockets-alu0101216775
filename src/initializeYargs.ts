import { Note } from './Note'
import { RequestType } from './infoTypes'

import * as yargs from 'yargs';
import * as chalk from 'chalk';

/**
 * Función encargada de procesar los argumentos de entrada por la línea de comandos.
 */
export function InitializeYargsCommands(): RequestType {
  let req: RequestType = { type: "add" };
  //Comando ADD: Usado para añadir una nueva nota
  yargs.command({
    command: 'add',
    describe: 'Add a new note',
    builder: {
      title: {
        describe: 'Note title',
        demandOption: true,
        type: 'string',
      },
      body: {
        describe: 'Note body',
        demandOption: true,
        type: 'string',
      },
      user: {
        describe: 'Uer who owns the note',
        demandOption: true,
        type: 'string',
      },
      color: {
        describe: 'Note color',
        demandOption: false,
        type: 'string',
      },
    },
    handler(argv) {
      //Comprueba que los argumentos requeridos sean del tipo correcto
      if (typeof argv.title === 'string' && typeof argv.body === 'string' && typeof argv.user === 'string') {
        let noteToAdd: Note;
        //Retira caracteres especiales del titulo para evitar problemas con el sistema de ficheros, y genera el nombre del fichero en formato json
        let filename: string = argv.title.replace(/[&\/\\#,+()$~%.'":*?<>{}!¡¿]/g, '') + '.json';
        //Genera la ruta de la nota, usando su usuario y su nombre de fichero
        let notePath: string = `notes/${argv.user}/${filename}`;
        //Comprueba si se ha pasado el parámetro no requerido "color". Si no es así, se asigna blue por defecto en la petición.
        if (typeof argv.color === 'string') req = { type: 'add', title: argv.title, body: argv.body, user: argv.user, route: notePath, color: argv.color };
        else req = { type: 'add', title: argv.title, body: argv.body, user: argv.user, route: notePath, color: "blue" };
        return req;
      }
    },
  }),
    //Comando REMOVE: Usado para eliminar una nota
    yargs.command({
      command: 'remove',
      describe: 'Remove new note',
      builder: {
        title: {
          describe: 'Note title',
          demandOption: true,
          type: 'string',
        },
        user: {
          describe: 'Uer who owns the note',
          demandOption: true,
          type: 'string',
        },
      },
      handler(argv) {
        //Comprueba que los argumentos requeridos sean del tipo correcto
        if (typeof argv.title === 'string' && typeof argv.user === 'string') {
          //Retira caracteres especiales del titulo para evitar problemas con el sistema de ficheros, y genera el nombre del fichero en formato json
          let filename: string = argv.title.replace(/[&\/\\#,+()$~%.'":*?<>{}!¡¿]/g, '') + '.json';
          //Genera la ruta en la que debería estar la nota, usando su usuario y su nombre de fichero
          let noteRoute: string = `notes/${argv.user}/${filename}`;
          //Genera la petición
          req = { type: 'remove', route: noteRoute };
          return req;
        }
      },
    }),
    //Comando MODIFY: Usado para hacer cambios a una nota
    yargs.command({
      command: 'modify',
      describe: 'Modify a note',
      builder: {
        title: {
          describe: 'Note title',
          demandOption: true,
          type: 'string',
        },
        user: {
          describe: 'Uer who owns the note',
          demandOption: true,
          type: 'string',
        },
        newtitle: {
          describe: 'New note title',
          demandOption: false,
          type: 'string',
        },
        newbody: {
          describe: 'New note body',
          demandOption: false,
          type: 'string',
        },
        newcolor: {
          describe: 'New note color',
          demandOption: false,
          type: 'string',
        },
      },
      handler(argv) {
        //Comprueba que los argumentos requeridos sean del tipo correcto
        if (typeof argv.title === 'string' && typeof argv.user === 'string') {
          //Crea variables para el control de parámetros opcionales
          let hasNewTitle: boolean = false, hasNewBody: boolean = false, hasNewColor: boolean = false, ntitle: string = "", nbody = "", ncolor = "";
          //Comprueba qué parámetros opcionales se han pasado
          if (typeof argv.newtitle === 'string') {
            hasNewTitle = true;
            ntitle = argv.newtitle;
          }
          if (typeof argv.newbody === 'string') {
            hasNewBody = true;
            nbody = argv.newbody;
          }
          if (typeof argv.newcolor === 'string') {
            hasNewColor = true;
            ncolor = argv.newcolor;
          }
          //Marca error si no se ha indicado ningún parámetro a modificar
          if (!hasNewBody && !hasNewTitle && !hasNewColor) {
            console.error(chalk.red("You need to add at least something to modify!\n\n--newtitle\n--newbody\n--newcolor"));
            req = { type: 'null' };
            return req;
          }
          else {
            //Retira caracteres especiales del titulo para evitar problemas con el sistema de ficheros, y genera el nombre del fichero en formato json
            let filename: string = argv.title.replace(/[&\/\\#,+()$~%.'":*?<>{}!¡¿]/g, '') + '.json';
            //Genera la ruta en la que debería estar la nota, usando su usuario y su nombre de fichero
            let noteRoute: string = `notes/${argv.user}/${filename}`;
            //Crea la petición haciendo uso de los parámetros recibidos, y la retorna
            req = { type: 'modify', title: argv.title, user: argv.user, route: noteRoute, newtitle: ntitle, newbody: nbody, newcolor: ncolor };
            return req;
          }
        }
      },
    }),
    //Comando LIST: Usado para mostrar todas las notas de un usuario
    yargs.command({
      command: 'list',
      describe: 'List user notes',
      builder: {
        user: {
          describe: 'User who owns the notes',
          demandOption: true,
          type: 'string',
        },
      },
      handler(argv) {
        //Comprueba que el argumento requerido sea del tipo correcto
        if (typeof argv.user === 'string') {
          //Genera la petición
          req = { type: 'list', user: argv.user};
          return req;
        }
      },
    }),
    //Comando READ: Usado para leer una nota
    yargs.command({
      command: 'read',
      describe: 'Read a note',
      builder: {
        title: {
          describe: 'Note title',
          demandOption: true,
          type: 'string',
        },
        user: {
          describe: 'User who owns the note',
          demandOption: true,
          type: 'string',
        },
      },
      handler(argv) {
        //Comprueba que los argumentos requeridos sean del tipo correcto
        if (typeof argv.title === 'string' && typeof argv.user === 'string') {
          //Retira caracteres especiales del titulo para evitar problemas con el sistema de ficheros, y genera el nombre del fichero en formato json
          let filename: string = argv.title.replace(/[&\/\\#,+()$~%.'":*?<>{}!¡¿]/g, '') + '.json';
          //Genera la ruta en la que debería estar la nota, usando su usuario y su nombre de fichero
          let noteRoute: string = `notes/${argv.user}/${filename}`;
          //Genera la petición
          req = { type: 'read', title: argv.title, user: argv.user, route: noteRoute};
          return req;
        }
      },
    }).parse();
  return req;
}