import createMulter from "../config/produto.multer";

// .single("imagem") = aceita 1 arquivo no campo chamado 'imagem' do form-data
const uploadImage = createMulter({
  folder: "images",
  allowedTypes: ["image/jpeg", "image/png", "image/jpg"],
  fileSize: 10 * 1024 * 1024, // 10 MB
}).single("imagem");

export default uploadImage;
