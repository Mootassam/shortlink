import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { database } from "../../firebase";
import { useParams } from "react-router-dom";

function Detail() {
    const { parameter } = useParams();

  const [links, setLinks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (parameter) {
      const fetchLinks = async () => {
        try {
          const docRef = doc(database, "multiLinks", parameter); // Use the parameter as the document ID
          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            if (data.links) {
              const newLinks = data.links.map((item: any) => item.link);
              setLinks(newLinks);
            } else {
              console.log("No links found in the document.");
            }
          } else {
            console.log("Document not found.");
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching links:", error);
          setLoading(false);
        }
      };

      fetchLinks();
    }
  }, [parameter]);

  useEffect(() => {
    if (!loading && links.length > 0) {
      const lastVisitedIndex = parseInt(
        localStorage.getItem("lastVisitedIndex") || "0",
        10
      );
      const nextIndex = (lastVisitedIndex + 1) % links.length;
      const urlToVisit = links[nextIndex];
      localStorage.setItem("lastVisitedIndex", nextIndex.toString());
      window.location.replace(urlToVisit);
    }
  }, [loading, links]);

  return <></>;
}

export default Detail;
