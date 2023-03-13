import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/Header";
import SquigglyLines from "../components/SquigglyLines";

const Home: NextPage = () => {
  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Face Photo Restorer</title>
      </Head>

      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 sm:mt-15 mt-10">
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-normal text-slate-900 sm:text-7xl">
          Testing the
          <span className="relative whitespace-nowrap text-[#0984e3]">
            <SquigglyLines />
            <span className="relative"> Replicate API</span>
          </span>{" "}
        </h1>

        <div className="flex justify-center space-x-4">
          <Link
            className="bg-[#e17055] rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-[#fab1a0]"
            href="/restore"
          >
            Restore your photos
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
