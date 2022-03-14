import { get } from "../lib"

export default abstract class View {
    private template: string;
    private renderTemplate: string;
    private container: Element;
    private htmlList: string[];
  
    constructor(containerId: string, template: string) {
      const containerElement = get(containerId);
  
      if (!containerElement) {
        throw "the highest grade container doesn't exst";
      }
  
      this.container = containerElement;
      this.template = template;
      this.renderTemplate = template;
      this.htmlList = [];
    }
  
    protected updateView(): void {
      this.container.innerHTML = this.renderTemplate;
  
      // 되돌려놓아야 다음에 key값을 또 변경할 수 있다
      this.renderTemplate = this.template;
    }
  
    protected addHtml(htmlString: string): void {
      this.htmlList.push(htmlString);
    }
  
    protected getHtml(): string {
      const snapShot = this.htmlList.join('');
      this.resetHtmlList();
      return snapShot;
    }
  
    protected setTemplateData(key: string, value: string): void {
      this.renderTemplate = this.renderTemplate.replace(`{{__${key}__}}`, value);
    }
  
    private resetHtmlList(): void {
      while(this.htmlList.length > 0) {
        this.htmlList.pop();
      }
    }
  
    abstract render(page: string): void;
  }