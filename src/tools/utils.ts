export default abstract class Utils {
    public static toggleClass = (element: HTMLElement, oldClass: string, newClass: string) => element && element.classList.replace(oldClass, newClass)
}
