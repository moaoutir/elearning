export interface Course{
   _id: number | null;
   _titleCours: string;
   _description: string;
   _price : string;
   _domain:string;
   _module:string;
   _creator:string;
   _course: string | File | null;
   _tp:string | File | null;
   _image: string | File | null;
}

export interface Question{
  id_question: string | null;
  _question: string;
  _options: string[];
  _response: string;
  id_course:number;
  _score: number | null;
}
export interface Options{
  id_option: string| null;
  id_question: string | null;
  _options: string[];
}

export interface MyCourses{
  id: string | null;
  id_courses: number;
  user: string | null;
}
export interface Domain{
  id: number|null;
  name_domain: string;
}

export interface filiere{
  _id: number|null;
  id_domain:string|null;
  name_module: string;
}

export interface Certificate{
  id: string|null;
  id_course:number // on ajoute l'id de cour parceque on peut avoir des cour qui ont le meme nom
  _certificate: string;
  _learner: string;
  _nameCourse:string;
  _score:number;
}

export interface My_filiere{
  id:number;
  user:string;
  id_domain:number;
  list_id_module:number[];
}
export interface Email{
  text:string;
  sujet:string;
  email_destinataire:string;

}
