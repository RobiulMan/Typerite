const Post = require('../model/post');
const Profile = require('../model/profile');
/**
 *@namespace {bookmark checker}
 *@param {userId}
 *@function bookmarkItem(userId) return promice with data
 */
async function bookmarkItem(user) {
    let data;
    if (user) {
        const profile = await Profile.findOne({ user: user.id });

        if (profile) {
            data = profile.bookmarks;
        }
    }
    return data;
}

/**
 *@namespace Class get post from all catagories
 *@param {tagName = string, itemperpage = number, currentpage = number}
 *@method getPosts() return promice
 *@method getCoutnPage() return promice
 */
class CatagoriesDataIterator {
    constructor(tagName, itemPerPage, currentPage) {
        this.tagName = tagName.toUpperCase();
        this.itemPerPage = itemPerPage;
        this.currentPage = currentPage;
    }

    async getPosts() {
        this.posts = await Post.find({ tags: { $in: [this.tagName] } })
            .skip(this.itemPerPage * this.currentPage - this.itemPerPage)
            .limit(this.itemPerPage);
        return this.posts;
    }

    async getCountPage() {
        this.totalPost = await Post.countDocuments({ tags: { $in: [this.tagName] } });
        this.totalPage = this.totalPost / this.itemPerPage;
        return this.totalPage;
    }
}

const lifestyleGetController = async (req, res, next) => {
    const currentPage = parseInt(req.query.page, 10) || 1;
    const itemPerPage = 10;

    try {
        const catagories = new CatagoriesDataIterator('LIFESTYLE', itemPerPage, currentPage);
        const posts = await catagories.getPosts();
        const totalPage = await catagories.getCountPage();

        const bookmarks = await bookmarkItem(req.user);

        res.render('pages/categories/lifestyle', {
            posts,
            bookmarks,
            currentPage,
            itemPerPage,
            totalPage
        });
    } catch (err) {
        next(err);
    }
};

/**
 *below the all Catagories Controller
 */
const healthGetController = async (req, res, next) => {
    const currentPage = parseInt(req.query.page, 10) || 1;
    const itemPerPage = 10;
    try {
        const catagories = new CatagoriesDataIterator('HEALTH', itemPerPage, currentPage);
        const posts = await catagories.getPosts();
        const totalPage = await catagories.getCountPage();

        const bookmarks = await bookmarkItem(req.user);
        res.render('pages/categories/health', {
            posts,
            bookmarks,
            currentPage,
            itemPerPage,
            totalPage
        });
    } catch (err) {
        next(err);
    }
};

const familyGetController = async (req, res, next) => {
    const currentPage = parseInt(req.query.page, 10) || 1;
    const itemPerPage = 10;
    try {
        const catagories = new CatagoriesDataIterator('FAMILY', itemPerPage, currentPage);
        const posts = await catagories.getPosts();
        const totalPage = await catagories.getCountPage();

        const bookmarks = await bookmarkItem(req.user);
        res.render('pages/categories/family', {
            posts,
            bookmarks,
            currentPage,
            itemPerPage,
            totalPage
        });
    } catch (err) {
        next(err);
    }
};

const managementGetController = async (req, res, next) => {
    const currentPage = parseInt(req.query.page, 10) || 1;
    const itemPerPage = 10;
    try {
        const catagories = new CatagoriesDataIterator('MANAGMENT', itemPerPage, currentPage);
        const posts = await catagories.getPosts();
        const totalPage = await catagories.getCountPage();

        const bookmarks = await bookmarkItem(req.user);

        res.render('pages/categories/managment', {
            posts,
            bookmarks,
            currentPage,
            itemPerPage,
            totalPage
        });
    } catch (err) {
        next(err);
    }
};

const travelGetController = async (req, res, next) => {
    const currentPage = parseInt(req.query.page, 10) || 1;
    const itemPerPage = 10;
    try {
        const catagories = new CatagoriesDataIterator('TRAVEL', itemPerPage, currentPage);
        const posts = await catagories.getPosts();
        const totalPage = await catagories.getCountPage();

        const bookmarks = await bookmarkItem(req.user);

        res.render('pages/categories/travel', {
            posts,
            bookmarks,
            currentPage,
            itemPerPage,
            totalPage
        });
    } catch (err) {
        next(err);
    }
};

const workGetController = async (req, res, next) => {
    const currentPage = parseInt(req.query.page, 10) || 1;
    const itemPerPage = 10;
    try {
        const catagories = new CatagoriesDataIterator('WORK', itemPerPage, currentPage);
        const posts = await catagories.getPosts();
        const totalPage = await catagories.getCountPage();

        const bookmarks = await bookmarkItem(req.user);

        res.render('pages/categories/travel', {
            posts,
            bookmarks,
            currentPage,
            itemPerPage,
            totalPage
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    lifestyleGetController,
    healthGetController,
    familyGetController,
    managementGetController,
    travelGetController,
    workGetController
};
