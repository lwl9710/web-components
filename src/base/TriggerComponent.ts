import BaseComponent from "@/base/BaseComponent";

export default abstract class TriggerComponent<E extends Event> extends BaseComponent {
  protected triggerEvent(eventType: string, eventData?: AnyObject): void {
    const event: E = this.createEventInstance(eventType, eventData);
    if(event !== null) {
      this.dispatchEvent(event);
    }
  }

  protected abstract createEventInstance<D = any>(eventType: string, eventData?: D): E;
}
