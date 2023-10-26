import authAxios from "../../modules/shared/axios/authAxios";
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  where,
  getDoc,
  deleteDoc,
  updateDoc,
  limit,
  doc,
} from "firebase/firestore";

import { database, auth, provider } from "../../firebase";
import Date from "../../modules/shared/date";
import Message from "../../modules/shared/Message";
import { signInWithPopup } from "@firebase/auth";
import axios from "axios";

export const fetchLinks = async (user) => {
  try {
    if (!user) {
      return "";
    }
    const q = query(
      collection(database, "links"),
      where("userId", "==", user),
      limit(10) // Order by the "createdAt" field in descending order
    );

    return new Promise<any[]>((resolve, reject) => {
      onSnapshot(
        q,
        (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          resolve(data); // Resolve the promise with the updated data
        },
        (error) => {
          reject(error); // Reject the promise if there's an error
        }
      );
    });
  } catch (error) {
    // Handle any errors here
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error to handle it at a higher level if needed
  }
};

export const SearchUrl = async (shortUrl) => {
  try {
    return new Promise(async (resolve, reject) => {
      const q = query(
        collection(database, "links"),
        where("shortlink", "==", shortUrl)
        // Order by the "createdAt" field in descending order
      );
      onSnapshot(
        q,
        (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          resolve(data); // Resolve the promise with the updated data
        },
        (error) => {
          reject(error); // Reject the promise if there's an error
        }
      );
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const generateShortLinks = async (url: any) => {
  try {
    const response = await authAxios.post("/create", { url: url });
    return response.data.data.tiny_url;
  } catch (error) {
    console.log("error generating the links");
  }
};

export const deleteShortLink = async (shortLink) => {
  try {
    const response = await authAxios.delete(`/delete?url=${shortLink}`);
    if (response.status === 204) {
      console.log("Short link deleted successfully");
    } else {
      console.log("Failed to delete the short link");
    }
  } catch (error) {
    console.log("Error deleting the link:", error);
  }
};
export const saveLink = async (original, short, idDoc) => {
  try {
    const user = auth.currentUser;
    if (user) {
      await addDoc(collection(database, "links"), {
        date: Date.createdAt(),
        originallink: original,
        shortlink: short,
        status: "active",
        userId: user.uid,
        multiId: idDoc,
      });
    } else {
      Message.Error("User not authenticated");
      throw new Error("User not authenticated");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const deleteMultiLinks = async (id) => {
  try {
    const docRef = doc(database, "multiLinks", id);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      await deleteDoc(docRef);
    }
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

export const deleteLink = async (docId) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(database, "links", docId);
      // Check if the document exists before attempting to delete
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        // Document exists, so it can be deleted
        await deleteDoc(docRef);
        Message.Success("Document successfully deleted!");
      } else {
        Message.Error("Document does not exist.");
      }
    } else {
      Message.Error("User not authenticated");
    }
  } catch (error) {
    Message.Error("Error deleting document");
    console.error("Error deleting document:", error);
    throw error;
  }
};
export const saveMulti = async (original) => {
  try {
    return new Promise(async (resolve, reject) => {
      const idDoc = await addDoc(collection(database, "multiLinks"), {
        date: Date.createdAt(),
        links: original,
        status: "active",
        currentIndex: 0,
      });
      resolve(idDoc.id);
      reject((error) => {
        error;
      });
    });
  } catch (error) {}
};

export const loginService = async () => {
  try {
    const response = await signInWithPopup(auth, provider);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const logoutService = async () => {
  try {
    auth.signOut();
  } catch (error) {
    console.log(error);
  }
};
export const shortUrlUpdate = async (docId, updatedData) => {
  try {
    const docRef = doc(database, "multiLinks", docId);
    await updateDoc(docRef, { links: updatedData });
    Message.Success("Document updated successfully");
  } catch (error) {
    Message.Error("Error updating document:");
    throw error;
  }
};

export const getDocumentDetails = (docId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = doc(database, "multiLinks", docId);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        // Document exists, you can access its data
        const data = docSnapshot.data();
        resolve(data);
      } else {
        resolve(null); // Document does not exist
      }
    } catch (error) {
      console.error("Error getting document:", error);
      reject(error);
    }
  });
};

export const send = async (links) => {
  try {
    const response = await axios.post("http://192.168.20.100:3000/api/send", {
      links,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const UpdateCurrentIndex = async (index, docId) => {
  try {
    const docRef = doc(database, "multiLinks", docId);
    await updateDoc(docRef, { currentIndex: index });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
