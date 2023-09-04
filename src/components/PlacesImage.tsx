import React from "react";
import styles from "@/styles/places-image.module.css";

interface Props {
  facultyName: string;
}

interface FacultyToImage {
  [facultyName: string]: string;
}

const PlacesImage: React.FC<Props> = ({ facultyName }) => {
  const facultyToImage: FacultyToImage = {
    คณะเกษตร: "/assets/faculty-background/Faculty_of_Agriculture.jpg",
    คณะอุตสาหกรรมเกษตร:
      "/assets/faculty-background/Faculty_of_Agro-Industry.jpg",
    คณะสถาปัตยกรรมศาสตร์:
      "/assets/faculty-background/Faculty_of_Architecture.jpg",
    คณะบริหารธุรกิจ:
      "/assets/faculty-background/Faculty_of_Business_Administration.jpg",
    คณะเศรษฐศาสตร์: "/assets/faculty-background/Faculty_of_Economics.jpg",
    คณะศึกษาศาสตร์: "/assets/faculty-background/Faculty_of_Education.jpg",
    คณะวิศวกรรมศาสตร์: "/assets/faculty-background/Faculty_of_Engineering.jpg",
    คณะสิ่งแวดล้อม: "/assets/faculty-background/Faculty_of_Environment.jpg",
    คณะประมง: "/assets/faculty-background/Faculty_of_Fisheries.jpg",
    คณะวนศาสตร์: "/assets/faculty-background/Faculty_of_Forestry.jpg",
    คณะมนุษยศาสตร์: "/assets/faculty-background/Faculty_of_Humanities.jpg",
    คณะวิทยาศาสตร์: "/assets/faculty-background/Faculty_of_Science.jpg",
    คณะสังคมศาสตร์: "/assets/faculty-background/Faculty_of_Social_Sciences.jpg",
    คณะสัตวแพทยศาสตร์:
      "/assets/faculty-background/Faculty_of_Veterinary_Medicine.jpg",
    คณะเทคนิคการสัตวแพทย์:
      "/assets/faculty-background/Faculty_of_Veterinary_Technology.jpg",
  };

  return (
    <div className="h-1/3">
      <img
        className=".place_image w-full"
        src={facultyToImage[facultyName]}
        alt={`Image for ${facultyName}`}
      />
    </div>
  );
};

export default PlacesImage;
