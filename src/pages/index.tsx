import { DataInterface } from "@/interfaces/DataInterface";
import pb from "@/services/pocketbase";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { Label, Select, Button } from "flowbite-react";
import { useRouter } from "next/router";
import { useLocalStorage } from "usehooks-ts";
import Background from "@/assets/background.png";

interface Props {}

const Index: NextPage<Props> = () => {
  const { push } = useRouter();
  const [isLoading, setisLoading] = useState(true)
  const [Data, setData] = useState<DataInterface[]>([]);
  const [selectedFacultyLocal, setSelectedFacultyLocal] = useState<DataInterface>();
  const [selectedFaculty, setSelectedFaculty] = useLocalStorage<DataInterface | null>(
    "faculty-id",
    null
  );

  const onInit = async () => {
    pb.autoCancellation(false);
    const records = await pb.collection("data").getFullList<DataInterface>({
      sort: "-created",
      fields: "faculty_name,id",
    });
    setisLoading(false)
    setData(records);
    setSelectedFacultyLocal(records[0]);
  };

  const onChange = (e: any) => {
    const faculty = Data.find((f) => f.id === e.target.value);
    setSelectedFacultyLocal(faculty!);
  };

  const onSubmit = (e: any) => {
    selectedFacultyLocal && setSelectedFaculty(selectedFacultyLocal);
  };

  useEffect(() => {
    onInit();
    document.body.style.background = `url(${Background.src}) fixed bottom`;
  }, []);

  useEffect(() => {
    if (selectedFaculty) {
      push("/play");
    }
  }, [selectedFaculty]);

  return (
    <div className="flex h-screen flex-col items-center justify-center px-5">
      <div className="text-[5rem] md:text-[10rem] text-white drop-shadow-lg">POP KU</div>
      <div className="flex w-full max-w-lg flex-col gap-3">
        <div className="text-xl text-white drop-shadow-lg">เลือกคณะ</div>
        <Select onChange={onChange} required disabled={isLoading}>
          {Data.map((e) => (
            <option key={e.id} value={e.id}>
              {e.faculty_name}
            </option>
          ))}
        </Select>
        <Button onClick={onSubmit}>เล่น</Button>
      </div>
    </div>
  );
};

export default Index;
