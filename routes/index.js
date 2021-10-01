var express = require('express');
var router = express.Router();
const bookController=require('../controllers/book.controller');
const multerConfig=require('../middlewares/multer');
const emailService=require('../middlewares/services/email.service');
const {guard}=require('../middlewares/guard');
const emailService3=require('../middlewares/services/email3.service');

/* GET home page. */
router.get('/', (req,res)=>{
  res.render('index')
});

router.get('/add-book',guard, multerConfig, bookController.addBook);

router.post('/add-book',guard, multerConfig, bookController.addOneBook);

router.get('/book-detail/:id',guard, bookController.show);

router.get('/delete-book/:id',guard, bookController.delete);

router.get('/emprunter-livre/:id',guard,(req,res)=>{
  return res.render('emprunt');
})

router.post('/emprunter-livre/:id',guard, bookController.emprunter,emailService,bookController.rappel,emailService3);

router.get('/donnees-emprunts',guard, bookController.donneesEmprunts);

router.get('/delete-emprunteur/:id',guard, bookController.deleteEmprunteur);

router.get('/modifier-emprunteur/:id',guard, bookController.modifierEmprunteur);

router.post('/modifier-emprunteur/:id',guard, bookController.modifierUnEmprunt);

router.get('/livres',multerConfig, bookController.livres);

router.get('/modifier-livre/:id',guard, bookController.modifierLivre);

router.post('/modifier-livre/:id',guard, multerConfig, bookController.modifierUnLivre);

router.get('/ajouter-categorie',guard, (req,res)=>{
  return res.render('ajouter-categorie');
});

router.post('/ajouter-categorie',guard, bookController.ajouterCategorie);

router.get('/test',(req,res)=>{
  res.render('test');
})

module.exports = router;
