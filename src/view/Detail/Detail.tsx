import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { database } from "../../firebase";
import { useParams } from "react-router-dom";
import { UpdateCurrentIndex } from "../../store/shortLink/shortLinkService";

function Detail() {
  const { parameter } = useParams();
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState<string[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  useEffect(() => {
    if (parameter) {
      const fetchLinks = async () => {
        try {
          const docRef = doc(database, "multiLinks", parameter);
          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            const linksData = data?.links || [];
            const currentIndex = data?.currentIndex || 0;

            if (linksData.length > 0) {
              const newIndex =
                currentIndex < linksData.length - 1 ? currentIndex + 1 : 0;
              setCurrentIndex(newIndex);
              await UpdateCurrentIndex(newIndex, parameter);
              const newLinks = linksData.map((item: any) => item.link);
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
    if (!loading && links && links.length > 0 && currentIndex !== null) {
      // Preload the destination page for faster redirection
      const preloadLink = document.createElement("link");
      preloadLink.href = links[currentIndex];
      preloadLink.rel = "preload";
      preloadLink.as = "document";
      document.head.appendChild(preloadLink);

      // Perform the actual redirection
      window.location.replace(links[currentIndex]);
    }
  }, [loading, links, currentIndex]);

  return (
    <div className="body__detail">
      <div className="spinner"></div>
    </div>
  );
}

export default Detail;
