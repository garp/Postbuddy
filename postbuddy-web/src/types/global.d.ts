interface Window {
  Razorpay: any;
}

declare module 'random-animal-name-generator' {
  const generateRandomAnimalName: () => string;
  export = generateRandomAnimalName;
}

declare const chrome: any;