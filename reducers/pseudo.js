export default function(pseudo = '', action) {
    if(action.type == 'savePseudo') {
        console.log(action.pseudo)
        return action.pseudo;
    } else {
        return pseudo;
    }
}