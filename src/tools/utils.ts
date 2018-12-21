export default abstract class Utils {
    public static toggleClass = (element: HTMLElement, oldClass: string, newClass: string) => element && element.classList.replace(oldClass, newClass)

    public static slugify(str: string) {
        const a = 'ãàáäâèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/-,:;'
        const b = 'aaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh______'
        const p = new RegExp(a.split('').join('|'), 'g')

        return str.toString().toLowerCase()
            .replace(/\s+/g, '_')           // Replace spaces with _
            .replace(p, (c) =>
                b.charAt(a.indexOf(c)))     // Replace special chars
            .replace(/&/g, '_and_')         // Replace & with 'and'
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '_')         // Replace multiple - with single _
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '')            // Trim - from end of text
    }
}
