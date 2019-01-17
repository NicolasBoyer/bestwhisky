import { EFieldType } from '../components/speedui/field'

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

    public static isValidEmail(email: string) {
        const validEmail = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i
        return validEmail.test(email)
    }

    public static isValidUrl(url: string) {
        const validUrl = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm
        return validUrl.test(url)
    }

    public static isValidPassword(password: string) {
        return password.length >= 8
    }

    public static isValidRegexp(value: string, regExp: RegExp) {
        return regExp.test(value)
    }

    public static isValidField(field: HTMLInputElement) {
        return this.isValidPassword(field.value) && field.type === EFieldType.password || this.isValidEmail(field.value) && field.type === EFieldType.email || field.pattern && this.isValidRegexp(field.value, new RegExp(field.pattern)) || this.isValidUrl(field.value) && field.type === EFieldType.url || field.type !== EFieldType.password && field.type !== EFieldType.email && field.type !== EFieldType.url && !field.pattern && (!field.required || field.required && field.value !== '')
    }

    public static getParents = (node: HTMLElement): HTMLElement[] => (node.parentElement ? Utils.getParents(node.parentElement) : []).concat([node])

    public static isClassNameInParents(node: HTMLElement, className: string) {
        for (const parent of this.getParents(node)) {
            if (parent.classList.contains(className)) {
                return true
            }
        }
        return false
    }

    public static isStrInParentsClass(node: HTMLElement, str: string) {
        for (const parent of this.getParents(node)) {
            if (parent.className.indexOf(str) !== -1) {
                return true
            }
        }
        return false
    }
}
