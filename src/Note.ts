/**
 * Clase para representar las NOtas generadas por el programa
 */
export class Note {
    title: string;
    body: string;
    color: string;
    user: string;
    route: string;

    /**
     * Constructor de la nota
     * @param title 
     * @param body 
     * @param user 
     * @param color 
     * @param route 
     */
    constructor(title: string = "", body: string = "", user: string = "", color: string = "white", route: string = "") {
        this.title = title;
        this.route = route;
        this.body = body;
        this.color = color;
        this.user = user;
    }

    /**
     * Obtiene el titulo
     * @returns {string} Title
     */
    getTitle(): string {
        return this.title;
    }

    /**
     * Obtiene el texto de la nota
     * @returns {string} Body
     */
    getBody(): string {
        return this.body;
    }

    /**
     * Obtiene el color
     * @returns {string} color
     */
    getColor(): string {
        return this.color;
    }

    /**
     * Obtiene el usuario propietario de la nota
     * @returns {string} user
     */
    getUser(): string {
        return this.user;
    }

    /**
     * Obtiene la ruta del fichero
     * @returns {string} route
     */
    getRoute(): string {
        return this.route;
    }

    /**
     * Cambia el titulo
     * @param newtitle 
     */
    setTitle(newtitle: string): void {
        this.title = newtitle;
    }

    /**
     * Cambia el contenido
     * @param body 
     */
    setBody(body: string): void {
        this.body = body;
    }

    /**
     * Cambia el color
     * @param color 
     */
    setColor(color: string): void {
        this.color = color;
    }

    /**
     * Cambia la ruta
     * @param route 
     */
    setRoute(route: string): void {
        this.route = route;
    }

    /**
     * Cambia el usuario
     * @param route 
     */
    setUser(user: string): void {
        this.user = user;
    }
}