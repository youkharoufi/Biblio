const multer=require('multer');

const MIME_TYPES={
    'image/jpg':'jpg',
    'image/jpeg':'jpg',
    'image/png':'png'
}

const storage=multer.diskStorage({
    destination:(req,file,callback)=>{
            callback(null,'public/images/livres/');
    },
    filename:(req,file,callback)=>{
        var name=Math.floor(Math.random()*Math.floor(123456789)).toString();
        name+=Math.floor(Math.random()*Math.floor(123456789)).toString();
        name+=Math.floor(Math.random()*Math.floor(123456789)).toString();
        name+=Math.floor(Math.random()*Math.floor(123456789)).toString();
        name+=Date.now()+".";
        const extension=MIME_TYPES[file.mimetype];
        name+=extension;

        callback(null,name)
    }



})

module.exports=multer({storage}).single('image');