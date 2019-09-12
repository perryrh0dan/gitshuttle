interface Serializable<T> {
  deserialize(input: Object): T;
}

export class Settings implements Serializable<Settings> {
  language: string;

  constructor() {
    this.language = 'en';
  }

  deserialize(input) {
    this.language = input.language;

    return this;
  }
}
