import "mocha";
import {expect} from 'chai';
import {Note} from '../src/Note'

let note2: Note = new Note();
note2.setTitle("Note2");
note2.setBody("Note2 body");
note2.setColor("blue");
note2.setRoute("./notes");
note2.setUser("adrianglez");

describe('Note tests', () => {
    it('Note initializes properly', () => {
        let note: Note = new Note("Blue note", "I am blue", "Miguel", "Blue", "../notes/miguel/BlueNote.json");
        expect(note.title).to.be.eql("Blue note");
    });
    it('Note setTitle and getTitle work properly', () => {
        expect(note2.getTitle()).to.be.eql("Note2");
    });
    it('Note setBody and getBody work properly', () => {
        expect(note2.getBody()).to.be.eql("Note2 body");
    });
    it('Note setColor and getColor work properly', () => {
        expect(note2.getColor()).to.be.eql("blue");
    });
    it('Note setUser and getUser work properly', () => {
        expect(note2.getUser()).to.be.eql("adrianglez");
    });
    it('Note setRoute and getRoute work properly', () => {
        expect(note2.getRoute()).to.be.eql("./notes");
    });
});