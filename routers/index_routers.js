const express = require("express");
const path = require("path");
const router = express.Router();
const register = require("../controllers/register");
const login = require("../controllers/login");
const User = require("../models/user");
const Entry = require("../models/entry");
const multer = require("multer");
const passport = require("passport");
const ensureAuthenticated = require("../middleware/isAuthenticated");
const link = "https://kappa.lol/OFmCl";
const messanger = "https://kappa.lol/iSONv";



router.get("/", function (req, res) {
  res.render("index", { link: link, messanger: messanger });
});
router.get("/about", function (req, res) {
  res.render("about", { user: req.user });
});
router.get("/catalog", async function (req, res) {
  try {
    let musicCatalogItems = [
      { name: "Страницы русской поэзии XVIII-XX в.в. - А.А.Фет", image: "https://kappa.lol/QkTKY", category: "music" },
      { name: "Страницы русской поэзии XVIII-XX в.в. - А.С.Пушкин", image: "https://kappa.lol/uRI1b", category: "music" },
      { name: "Страницы русской поэзии XVIII-XX в.в - Н.А.Некрасов", image: "https://kappa.lol/P3kre", category: "music" },
      { name: "Страницы русской поэзии XVIII-XX в.в. - Э.Г. Багрицкий", image: "https://kappa.lol/hPlG3", category: "music" },
 
    ];

    let poetryCatalogItems = [
      { name: "Демьян Бедный Страницы Русской Поэзии XVIII-XX Веков", image: "https://kappa.lol/Xh2M7", category: "poetry" },
      { name: "Владимир Маяковский Страницы Русской Поэзии XVIII-XX Веков", image: "https://kappa.lol/cKoQX", category: "poetry" },
      { name: "Александ Блок Страницы Русской Поэзии XVIII-XX Веков", image: "https://kappa.lol/HJOU-", category: "poetry" },
    ];

    let proseCatalogItems = [
      { name: "Лев Толстой «Война и мир» ", image: "https://kappa.lol/go7DB", category: "prose" },
    
    ];

   
    let catalogItems;
    if (req.query.category === "music") {
      catalogItems = musicCatalogItems;
    } else if (req.query.category === "poetry") {
      catalogItems = poetryCatalogItems;
    } else if (req.query.category === "prose") {
      catalogItems = proseCatalogItems;
    } else {
   
      catalogItems = musicCatalogItems.concat(poetryCatalogItems, proseCatalogItems);
    }

    res.render("catalog", { user: req.user, catalogItems: catalogItems });
  } catch (err) {
    console.error("Error fetching catalog items:", err);
    res.status(500).send("Ошибка при получении элементов каталога");
  }
});

router.get("/findus", function (req, res) {
  res.render("findus", {
    libraryImage: "https://ic.pics.livejournal.com/a_les_sandro/76103102/1836994/1836994_original.jpg", // Путь к картинке библиотеки
    libraryDescription: "Муниципальное автономное учреждение культуры. Центральная городская библиотека А. Аалто муниципального образования. Город Выборг Выборгского района Ленинградской области",
    libraryAddress: "Улица Суворова, 4, Выборг, Россия",
    libraryPhone: "+7 (81378) 2-21-98"
  });
});


router.get("/service_request", function (req, res) {
  res.render("service_request", { user: req.user, link: link, messanger: messanger });
});

router.post("/submit_request", ensureAuthenticated, async (req, res) => {
  const username = req.user ? req.user.name : null;
  const { service, bookingTime } = req.body;


  const data = {
    username: username,
    title: "Новая заявка",
    content: `${service}`,
    imagePath: "",
    bookingTime: bookingTime,
  };

  try {
    await Entry.create(data);
    res.redirect(`/profile?service=${encodeURIComponent(service)}`);
  } catch (err) {
    console.error("Error submitting service request:", err);
    res.status(500).send("Ошибка при отправке заявки");
  }
});
router.get("/cancel_request/:id", ensureAuthenticated, async (req, res) => {
  const requestId = req.params.id;

  try {
    await Entry.deleteById(requestId);
    res.redirect("/profile");
  } catch (err) {
    console.error("Error cancelling request:", err);
    res.status(500).send("Ошибка при отмене заявки");
  }
});


router.get("/profile", ensureAuthenticated, async function (req, res) {
  try {
 
    Entry.selectAll((err, userRequests) => {
      if (err) {
        console.error("Error fetching user requests:", err);
        return res.status(500).send("Ошибка при получении заявок пользователя");
      }

      res.render("profile", { user: req.user, requests: userRequests, link: link });
    });
  } catch (err) {
    console.error("Error fetching user requests:", err);
    res.status(500).send("Ошибка при получении заявок пользователя");
  }
});

router.get("/register", register.form);

router.post("/register", register.submit);

router.get("/login", login.form);

router.post("/login", login.submit);

router.get("/pc", function (req, res) {
  res.render("pc", { link: link, messanger: messanger });
});

router.get("/laptop", function (req, res) {
  res.render("laptop", { link: link, messanger: messanger });
});
router.get("/contacts", function (req, res) {
  res.render("contacts", { link: link, messanger: messanger });
});
router.get("/index", function (req, res) {
  res.render("index", { link: link, messanger: messanger });
});
router.get("/services", function (req, res) {
  res.render("services", { link: link, messanger: messanger });
});
router.get("/discounts", function (req, res) {
  res.render("discounts", { link: link, messanger: messanger });
});

router.put("/edit/:id", async (req, res, next) => {
  try {
    const { title, content, imagePath } = req.body;
    const entry = await Entry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: "Запись не найдена" });
    }
    entry.title = title;
    entry.content = content;
    entry.imagePath = imagePath;
    entry.timestamp = new Date();
    await entry.save();
    res.json(entry);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/auth/yandex",
  passport.authenticate("yandex"),
);

router.get(
  "/auth/yandex/callback",
  passport.authenticate("yandex", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/index");
  }
);

router.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' })
);

router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

router.get("/auth/vkontakte", passport.authenticate("vkontakte"));

router.get(
  "/auth/vkontakte/callback",
  passport.authenticate("vkontakte", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.get("/logout", login.logout);

module.exports = router;
