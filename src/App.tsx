import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import FeatureHandler from "./handlers/FeaturesHandler";
import AdversaryHandler from "./handlers/AdversaryHandler";
import type { KeyList } from "./advlib/Types";
import PageHandler from "./handlers/PageHandler";
import FormHandler from "./handlers/FormHandler";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzD95f3R6Ncm6-cw5opZBOkdlDeBTJ3JA",
  authDomain: "daggerhearthb.firebaseapp.com",
  projectId: "daggerhearthb",
  storageBucket: "daggerhearthb.firebasestorage.app",
  messagingSenderId: "740976288593",
  appId: "1:740976288593:web:46fa8f3ba085279b812970",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const FORM = new FormHandler();
export const PAGES = new PageHandler();
export const FEATURES = new FeatureHandler();
export const ADVERSARIES = new AdversaryHandler();

export default function App() {
  //const [keyword, setKeyword] = useState("keyword");
  const [, setPages] = useState({} as KeyList);
  const [, setFeatures] = useState({} as KeyList);
  const [, setAdversaries] = useState({} as KeyList);
  const [, setForm] = useState({} as KeyList);

  PAGES.createPage("home", "Home", FORM.render);
  PAGES.createPage("adversaries", "Adversaries", ADVERSARIES.render);
  PAGES.createPage("adversary", "", ADVERSARIES.renderCurrent);

  useEffect(() => {
    FORM.init(setForm);
    PAGES.init(setPages, "home");
    FEATURES.init(setFeatures);
    ADVERSARIES.init(setAdversaries);
  }, []);

  return (
    <>
      {PAGES.renderNavbar()}
      {PAGES.render()}
    </>
  );

  // return (
  //   <>
  //     <Menu setPage={setPage} onSearch={setKeyword}></Menu>
  //     {page === "home" && (
  //       <Form
  //         features={FEATURES}
  //         saveAdversary={(a: Adversary) => {
  //           setAdversary(a);
  //           setPage("adversary");
  //         }}
  //       ></Form>
  //     )}
  //     {getCards(keyword.toLowerCase(), page, ADVERSARIES, (a: Adversary) => {
  //       setAdversary(a);
  //       setPage("adversary");
  //     })}
  //     {console.log(ADVERSARIES, activeAdversary)}
  //     {displayAdversary(activeAdversary, page)}
  //   </>
  // );
}
