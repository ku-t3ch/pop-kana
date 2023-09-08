import { DataInterface } from "@/interfaces/DataInterface";
import Image from "next/image";
import React from "react";

interface Props {
  facultyName: string;
  rank: DataInterface;
  place?: JSX.Element;
}

interface FacultyToImage {
  [facultyName: string]: string;
}

const PlacesImage: React.FC<Props> = ({ facultyName, rank, place }) => {
  const facultyToImage: FacultyToImage = {
    คณะเกษตร: "/assets/faculty-background/Faculty_of_Agriculture.jpg",
    คณะอุตสาหกรรมเกษตร: "/assets/faculty-background/Faculty_of_Agro-Industry.jpg",
    คณะสถาปัตยกรรมศาสตร์: "/assets/faculty-background/Faculty_of_Architecture.jpg",
    คณะบริหารธุรกิจ: "/assets/faculty-background/Faculty_of_Business_Administration.jpg",
    คณะเศรษฐศาสตร์: "/assets/faculty-background/Faculty_of_Economics.jpg",
    คณะศึกษาศาสตร์: "/assets/faculty-background/Faculty_of_Education.jpg",
    คณะวิศวกรรมศาสตร์: "/assets/faculty-background/Faculty_of_Engineering.jpg",
    คณะสิ่งแวดล้อม: "/assets/faculty-background/Faculty_of_Environment.jpg",
    คณะประมง: "/assets/faculty-background/Faculty_of_Fisheries.jpg",
    คณะวนศาสตร์: "/assets/faculty-background/Faculty_of_Forestry.jpg",
    คณะมนุษยศาสตร์: "/assets/faculty-background/Faculty_of_Humanities.jpg",
    คณะวิทยาศาสตร์: "/assets/faculty-background/Faculty_of_Science.jpg",
    คณะสังคมศาสตร์: "/assets/faculty-background/Faculty_of_Social_Sciences.jpg",
    คณะสัตวแพทยศาสตร์: "/assets/faculty-background/Faculty_of_Veterinary_Medicine.jpg",
    คณะเทคนิคการสัตวแพทย์: "/assets/faculty-background/Faculty_of_Veterinary_Technology.jpg",
  };

  return (
    <div className="relative flex-1 overflow-auto bg-fixed">
      <div className="absolute bottom-2 left-2 rounded-full bg-white/90 w-[6rem] h-[6rem] justify-center items-center flex gap-2">
        {place}
      </div>
       <Image
              className="h-full w-full object-cover"
              width={0}
              height={0}
              loading="lazy"
              sizes="100vw"
              src={facultyToImage[facultyName] as string}
              alt={`Image for ${facultyName}`}
            />
    </div>
  );
};

export default PlacesImage;
