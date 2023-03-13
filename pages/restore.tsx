import Header from "@/components/Header";
import { useState } from "react";
import Image from "next/image";
import Head from "next/head";
import "../app/globals.css";
import CountUp from "react-countup";
import ResizablePanel from "@/components/ResizablePanel";
import { AnimatePresence, motion } from "framer-motion";
import LoadingDots from "../components/LoadingDots";
import { UploadDropzone } from "react-uploader";
import { Uploader } from "uploader";
import Toggle from "@/components/Toggle";
import { CompareSlider } from "../components/CompareSlider";

const uploader = Uploader({
  apiKey: "free",
});

const options = {
  maxFileCount: 1,
  mimeTypes: ["image/jpeg", "image/png", "image/jpg"],
  editor: { images: { crop: false } },
  styles: { colors: { primary: "#000" } },
};

function restore() {
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [restoredLoaded, setRestoredLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [sideBySide, setSideBySide] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);

  const UploadDropZone = () => (
    <UploadDropzone
      uploader={uploader}
      options={options}
      onUpdate={(file) => {
        if (file.length !== 0) {
          setPhotoName(file[0].originalFile.originalFileName);
          setOriginalPhoto(file[0].fileUrl.replace("raw", "thumbnail"));
          generatePhoto(file[0].fileUrl.replace("raw", "thumbnail"));
        }
      }}
      width="670px"
      height="250px"
    />
  );

  async function generatePhoto(fileUrl: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl: fileUrl }),
    });

    let newPhoto = await res.json();
    if (res.status !== 200) {
      setError(newPhoto);
    } else {
      setRestoredImage(newPhoto);
    }
    setLoading(false);
  }

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2">
      <Head>
        <title>Restore Photos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex flex-1 w-full flex-col items-cneter justify-center text-center px-4 sm:mb-0 mb-8">
        <h1 className="mx-auto mt-8 max-w-4xl font-display text-4xl font-bold tracking-normal text-slate-900 sm:text-6xl mb-5">
          Restore any face photo
        </h1>

        <ResizablePanel>
          <AnimatePresence exitBeforeEnter>
            <motion.div className="flex justify-between items-center w-full flex-col mt-4">
              <Toggle
                className={`${restoredLoaded ? "visible" : "invisible"} mb-6`}
                sideBySide={sideBySide}
                setSideBySide={(newVal) => setSideBySide(newVal)}
              />
              {restoredLoaded && sideBySide && (
                <CompareSlider
                  original={originalPhoto!}
                  restored={restoredImage!}
                />
              )}
              {!originalPhoto && <UploadDropZone />}
              {originalPhoto && !restoredImage && (
                <Image
                  alt="Original photo"
                  src={originalPhoto}
                  className="rounded-2xl"
                  width={475}
                  height={475}
                />
              )}
              {restoredImage && originalPhoto && !sideBySide && (
                <div className="flex sm:space-x-4 sm:flex-row flex-col">
                  <div>
                    {" "}
                    <h2>Original Photo</h2>
                    <Image
                      alt="original photo"
                      src={originalPhoto}
                      className="rounded-2xl"
                      width={475}
                      height={475}
                    />
                  </div>

                  <div>
                    <h2 className="mb-1 font-medium text-lg">Restored Photo</h2>
                    <a href={restoredImage} target="_blank" rel="noreferrer">
                      <Image
                        alt="restored photo"
                        src={restoredImage}
                        className="rounded-2xl relative sm:mt-0 mt-2 cursor-zoom-in"
                        width={475}
                        height={475}
                        onLoadingComplete={() => setRestoredLoaded(true)}
                      />
                    </a>
                  </div>
                </div>
              )}
              {loading && (
                <button
                  disabled
                  className="bg-black rounded-full text-white font-medium px-4 pt-2 pb-3  mt-8 hover:bg-black/80 w-40"
                >
                  <span className="pt-4">
                    <LoadingDots color="white" style="large" />
                  </span>
                </button>
              )}
              {error && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-8"
                  role="alert"
                >
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <div className="flex space-x-2 justify-center">
                {originalPhoto && !loading && (
                  <button
                    onClick={() => {
                      setOriginalPhoto(null);
                      setRestoredImage(null);
                      setRestoredLoaded(false);
                      setError(null);
                    }}
                    className="bg-[#e17055] rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-[#fab1a0]"
                  >
                    Upload New Photo
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
    </div>
  );
}

export default restore;
