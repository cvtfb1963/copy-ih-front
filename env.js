export const isLocal = window.location.origin.includes("localhost");

const envProd = {
  calendly_link: "https://calendly.com/ihingles-info/30min",
  telefono: "34682699377",
  server: "https://www.iph-api.net",
  okta_domain: "iph.us.auth0.com",
  okta_clientId: "vaZPBZBPDa793Q1BARgrNuw4SDFBV9Oz",
  okta_audience: "https://www.iph-api.net",
  okta_scope: "read:current_user profile offline_access",
  stripe_public_key:
    "pk_live_51QvKBxIcAxootnX5wYSaSkQvmtzbAPK0yEl6WreOOhOSqw3rBOKe02RgSMjAU5b3k64OJe2n5FDQUwslvxhK7pVG00AxOXHUfR",
};

const envLocal = {
  calendly_link: "https://calendly.com/ihingles-info/30min",
  telefono: "34682699377",
  server: "http://localhost:5000",
  okta_domain: "dev-1f1c60qnpfuxkaxx.us.auth0.com",
  okta_clientId: "l3p9XLllnNArx62lrFqJRj48750mCYsY",
  okta_audience: "https://www.iph-api.net",
  okta_scope: "read:current_user profile offline_access",
  stripe_public_key:
    "pk_test_51KG6juBG5pIosEvRWLu9fmnNQhZ3m0EbQKa2yodQT3QD5qj2Y9E3e2U3pVy6m1eZMl9la0nQBFCjXl82MT6hXAA300gNv0YUTy",
};

export const FirebaseConfig = {
  apiKey: "AIzaSyDdMffrQqMPR843R7iP2Y7hOUwMKjfNZsM",
  authDomain: "iph-ingles.firebaseapp.com",
  projectId: "iph-ingles",
  storageBucket: "iph-ingles.appspot.com",
  messagingSenderId: "703902260699",
  appId: "1:703902260699:web:cf5ddf74357042cf1c5bfe",
  measurementId: "G-TQFSRJ1H8N",
};

// export const ENV = isLocal ? envLocal : envProd;
export const ENV = envProd;
