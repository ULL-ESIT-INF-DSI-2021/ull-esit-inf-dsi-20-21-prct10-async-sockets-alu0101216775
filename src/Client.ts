import * as net from 'net';
import * as chalk from 'chalk';
import { InitializeYargsCommands } from './initializeYargs'
import { RequestType, ResponseType } from './infoTypes'

//Genera la petición procesando los argumentos
let req: RequestType = InitializeYargsCommands();
//Si el tipo de la petición fuera null, no se enviará, ya que hubo un error en el procesamienmto de parámetros
if (req.type !== "null") {
    //Inicia la conexión con el servidor y manda la petición
    const client = net.connect({ port: 60300 });
    client.write(JSON.stringify(req) + '\n');
    //Crea la cadena donde se almacena la respuesta según va llegando
    let data: string = "";
    client.on('data', (dataJSON) => {
        data += dataJSON.toString();
    });
    //Genera y procesa el objeto de respuesta
    client.on('end', () => {
        const message: ResponseType = JSON.parse(data);
        if (message.type === 'add' || message.type === 'remove' || message.type === 'modify') {
            console.log(`Server output: `);
            console.log(chalk.green(message.message));
        } else if (message.type === 'read') {
            message.notes?.forEach(note => {
                console.log(chalk.keyword(note.color)(note.title));
                console.log(chalk.keyword(note.color)(note.body));
            })
        } else if (message.type === 'list') {
            let count: number = 1;
            console.log("Note list received from server: ");
            message.notes?.forEach(note => {
                console.log(chalk.keyword(note.color)(count.toString() + ")\t" + note.title));
                count++;
            })
        } else if (message.type === 'errcode') {
            console.error(chalk.red('There was an error in the server.'));
            console.error(chalk.red(`This is the server error message: \n${message.message}`));
        } else {
            console.error(chalk.red(`Response type not valid. (${message.type})`));
        }
    })
}
