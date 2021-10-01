const Category=require('../models/categorie.model');
const Book=require('../models/livre.model');
const User = require('../models/user.model');
const fs=require('fs');
const Emprunteur=require('../models/emprunteur.model');


exports.addBook=(req,res)=>{
    Category.find().then((categories)=>{return res.render('add-book',{categories:categories})}).catch(()=>{return res.redirect('/')})
}

exports.addOneBook=(req,res)=>{
    const book=new Book({
        titre:req.body.titre,
        auteur:req.body.auteur,
        categorie:req.body.categorie,
        image:`${req.protocol}://${req.get('host')}/images/livres/${req.file.filename}`,
        resume:req.body.resume,
        nbExemplaires:req.body.nbExemplaires,
        author:req.user

    })
    

    book.save((err,book)=>{
        if(err){
            req.flash('error',err.message);
            return res.redirect('/add-book')
        }
        User.findOne({_id:req.user._id},(err,user)=>{
            if(err){
                console.log(err.message)
            }
            
            user.books.push(book);
            
            user.save();
        })

        req.flash('success',"Votre Livre a ete ajoute !");
        return res.redirect('/add-book');
    })
}

exports.show=(req,res)=>{
    const id=req.params.id
    Book.findOne({_id:id,author:req.user._id}).then((book)=>{return res.render('show-book',{book:book})}).catch(()=>{return res.redirect('/')});
    
}

exports.delete=(req,res)=>{
    const id=req.params.id;
    Book.deleteOne({_id:id,author:req.user._id},(err,message)=>{
        if(err){
            req.flash('error',err.message);
            return res.redirect('/book-detail/'+id);
        }

        if(!message.deletedCount){
            req.flash("error","Desole, Vous ne pouvez pas supprimer ce livre !");
            return res.redirect("/book-detail/"+id);
          }

          req.flash('success',"Vous avez supprime ce livre");
          return res.redirect('/users/books');

    })
}

exports.emprunter=(req,res,next)=>{
    const id=req.params.id;

    Book.findOne({_id:id,author:req.user._id},(err,book)=>{
            if(err){
                req.flash('error',err.message);
                return res.redirect("/emprunt-livre/"+id)
            }

            if(!book){
                req.flash('error',"Vous ne pouvez pas faire emprunter se livre");
                return res.redirect("/emprunt-livre/"+id)
            }

    const emprunteur=new Emprunteur({
        nom:req.body.nomDeLEmprunteur,
        email:req.body.email,
        tel:req.body.numero,
        nbEmprunts:req.body.nombreDExemplaires,
        
    })
    emprunteur.livre=book.titre;
    
    
    emprunteur.save((err,emprunteur)=>{
        if(err){
            req.flash('error',err.message);
            return res.redirect('/emprunter-livre/'+id)
        }
        if(book.nbExemplaires==0){
            req.flash('error',"Il n'y a plus de livres a faire emprunter le stock est vide");
            return res.redirect('/emprunter-livre/'+id);
        }
        console.log(emprunteur);

        function addDays(date, days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
          }

        /*var ms = new Date().getTime() + 86400000;
        var tomorrow = new Date(ms);*/
        
        const date=Date.now();
        const date7=addDays(date,7);

        req.body.email=emprunteur.email;
        req.body.message="Vous avez emprunter le livre : "+book.titre+". Vous devrez le rendre dans une semaine c'est-a-dire le "+date7+". Bonne Lecture !";
        book.nbExemplaires=book.nbExemplaires-emprunteur.nbEmprunts;
        console.log(book);
        book.save();
        
        next();
    })
    
})

}

exports.rappel=(req,res,next)=>{
    setTimeout(()=>{

        const id=req.params.id
    
    Book.findOne({_id:id,author:req.user._id},(err,book)=>{
        if(err){
            req.flash('error',err.message);
            return res.redirect('/emprunter-livre/'+id)
        }

        Emprunteur.findOne({livre:book.titre},(err,emprunteur)=>{
            if(err){
                req.flash('error',err.message);
                return res.redirect('/emprunter-livre/'+id)
            }

        req.body.email=emprunteur.email;
        req.body.message="Rappel : Vous avez emprunter le livre : "+book.titre+" il y a maintenant 1 semaine. Rendez-le des que possible. Merci";

        next();

    })
})

    },180000)
      
}

exports.donneesEmprunts=(req,res)=>{
    Emprunteur.find().then((emprunteurs)=>{return res.render('emprunteurs',{emprunteurs:emprunteurs})}).catch(()=>{return res.redirect('/')})
}

exports.deleteEmprunteur=(req,res)=>{

    const id=req.params.id

    Emprunteur.findOne({_id:id},(err,emprunteur)=>{
        if(err){
          req.flash('error',err.message);
          return res.redirect('/donnees-emprunts')
      }

      if(!emprunteur){
          req.flash('error',"Emprunteur introuvable");
          return res.redirect('/donnees-emprunts');
      }
     

    Book.findOne({titre:emprunteur.livre},(err,book)=>{

      if(err){
          req.flash('error',err.message);
          return res.redirect('/donnees-emprunts')
      }

      if(!book){
        req.flash('error',"Livre introuvable");
        return res.redirect('/donnees-emprunts');
    }
        book.nbExemplaires=book.nbExemplaires+emprunteur.nbEmprunts;

        book.save()
    })
})

    
    Emprunteur.deleteOne({_id:id},(err,message)=>{
        if(err){
            req.flash('error',err.message);
            return res.redirect('/donnees-emprunts');
        }

        if(!message.deletedCount){
            req.flash("error","Desole, Vous ne pouvez pas supprimer ce livre !");
            return res.redirect("/donnees-emprunts");
          }

          

          req.flash('success',"Vous avez supprime cet emprunt");
          return res.redirect('/donnees-emprunts');

    })

}

exports.modifierEmprunteur=(req,res)=>{
    const id=req.params.id;
    Emprunteur.findOne({_id:id}).then((emprunteur)=>{return res.render('modifier-emprunt',{emprunteur:emprunteur})}).catch(()=>{return res.redirect('/')})
}

exports.modifierUnEmprunt=(req,res)=>{
    const id=req.params.id;
    Emprunteur.findOne({_id:id},(err,emprunteur)=>{
        if(err){
            req.flash('error',err.message);
            return res.redirect('/modifier-emprunteur/'+id);
        }

        emprunteur.nom=req.body.nomDeLEmprunteur?req.body.nomDeLEmprunteur:emprunteur.nom;
        emprunteur.tel=req.body.numero?req.body.numero:emprunteur.tel;
        emprunteur.nbEmprunts=req.body.nombreDExemplaires?req.body.nombreDExemplaires:emprunteur.nbEmprunts;
        emprunteur.email=req.body.email?req.body.email:emprunteur.email;

        emprunteur.save((err,emprunteur)=>{
            if(err){
                req.flash('error',err.message);
                return res.redirect('/modifier-emprunteur');
            }

            req.flash('success',"Vous avez modifie cet emprunt");
            return res.redirect('/donnees-emprunts');
        })

    })
}

exports.livres=(req,res)=>{
    Book.find().then((books)=>{return res.render('livres',{books:books})}).catch(()=>{return res.redirect('/')});
}

exports.modifierLivre=(req,res)=>{
    const id=req.params.id;
    Book.findOne({_id:id,author:req.user._id},(err,book)=>{
        if(err){
            req.flash('error',err.message);
            return res.redirect('/modifier-livre/'+id);
        }
        if(!book){
            req.flash('error',"Desole, vous ne pouvez pas modifier ce livre");
            return res.redirect("/book-detail/"+id);
          }
    Category.find((err,categories)=>{
        if(err){
            req.flash('error',err.message);
            return res.redirect('/modifier-livre/'+id);
        }

        return res.render('modifier-livre',{categories:categories,book:book});
    })
    })
}

exports.modifierUnLivre=(req,res)=>{
    const id=req.params.id;

    Book.findOne({_id:id,author:req.user._id},(err,book)=>{
        if(err){
            req.flash('error',err.message);
            return res.redirect('/modifier-livre/'+id);
        }
        if(!book){
            req.flash('error',"Vous ne pouve pas modifier ce livre");
            return res.redirect('/modifier-livre/'+id);
        }

        if(req.file){
            // http://localhost:3000/images/articles/46512351848.png
             const filename=article.image.split('/livres/')[1];
             fs.unlink(`public/images/livres/${filename}`,()=>{
               console.log('Deleted :'+filename)
             })
           }


        book.titre=req.body.titre?req.body.titre:book.titre;
        book.auteur=req.body.auteur?req.body.auteur:book.auteur;
        book.categorie=req.body.categorie?req.body.categorie:book.categorie;
        book.image=req.file?`${req.protocol}://${req.get('host')}/images/livres/${req.file.filename}`:book.image;
        book.resume=req.body.resume?req.body.resume:book.resume;
        book.nbExemplaires=req.body.nbExemplaires?req.body.nbExemplaires:book.nbExemplaires;

        console.log(book);

           book.save((err,book)=>{
               if(err){
                   req.flash('error',err.message);
                   return res.redirect('/modifier-livre/'+id)
               }

               req.flash('success',"Vous avez modifie ce livre");
               return res.redirect('/users/books');
           })

    })
}

exports.ajouterCategorie=(req,res)=>{
    const categorie=new Category({
        title:req.body.categorie
    })

    categorie.save((err,categorie)=>{
        if(err){
            req.flash('error',err.message);
            return res.redirect('/ajouter-categorie');
        }

        req.flash('success',"Vous avez ajoute une categorie");
        return res.redirect('/ajouter-categorie')
    })
}