class Element {

    public readonly tagName: string;

    public readonly children: Array<Element>;

    public constructor(tagName: string) {
        this.tagName = tagName;
        this.children = [];
    }

    public appendChild(element: Element) {
        this.children.push(element);
    }

}

class CSSRule {

    public cssText: string;

    public constructor(cssText: string) {
        this.cssText = cssText;
    }

}

class StyleSheet {

    public cssRules: Array<CSSRule>;

    public constructor() {
        this.cssRules = [];
    }

    public insertRule(cssText: string, index: number = 0) {
        this.cssRules.splice(index, 0, new CSSRule(cssText));
    }

}

class StyleElement extends Element {

    public sheet: StyleSheet;

    public constructor() {
        super('style');
        this.sheet = new StyleSheet();
    }

}

export const isStyleElement = (
    element: Element,
): element is StyleElement => element.tagName === 'style';

export const walkElements = function* (
    element: Element,
): IterableIterator<Element> {
    yield element;
    for (const childElement of element.children) {
        yield* walkElements(childElement);
    }
};

class Document {

    public readonly head: Element;

    public readonly body: Element;

    public constructor() {
        this.head = new Element('head');
        this.body = new Element('body');
    }

    public createElement(tagName: string) {
        switch (tagName) {
        case 'style':
            return new StyleElement();
        default:
            return new Element(tagName);
        }
    }

    public* walkElements(): IterableIterator<Element> {
        yield* walkElements(this.head);
        yield* walkElements(this.body);
    }

    public get stylesheets(): Array<StyleSheet> {
        const result: Array<StyleSheet> = [];
        for (const element of this.walkElements()) {
            if (isStyleElement(element)) {
                result.push(element.sheet);
            }
        }
        return result;
    }

}

export interface ISandbox<TExports extends {}> {
    document: Document,
    exports: Partial<TExports>,
}

export const createSandbox = <TExports extends {}>(): ISandbox<TExports> => ({
    document: new Document(),
    exports: {},
});
