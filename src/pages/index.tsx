import { DataInterface } from "@/interfaces/DataInterface";
import pb from "@/services/pocketbase";

export default function Home() {
  const update = async () => {
    await pb.collection("data").update<DataInterface>("vu7tba7w24ye4rq", {
      "count+": 1,
    });
  };

  return (
    <>
      <div onClick={update}>pop</div>
    </>
  );
}
