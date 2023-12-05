import Chat from "../../components/Chat";
import Header from "../../components/Header";
import AsideFiles from "../../components/AsideFiles";

function Home() {
  return (
    <div className="w-full h-screen ">
      <div>
        <Header />
      </div>
      <div className="flex ">
        <Chat />
        <AsideFiles />
      </div>
    </div>
  );
}

export default Home;
