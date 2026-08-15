import CupSectionCollection from './modules/CupSection.js'
import FooterBrandCollection from './modules/FooterBrand.js'
import initForms from './modules/Form.js'
import FormatsCollection from './modules/Formats.js'
import initHeader from './modules/Header.js'
import HeroModelCollection from './modules/HeroModel.js'
import initMainMenus from './modules/Menu.js'
import initPackageImages from './modules/Package.js'
import SmoothScroll from './modules/SmoothScroll.js'
import './modules/Modal.js'

new SmoothScroll()
initHeader()
initMainMenus()
initPackageImages()
initForms()
new FooterBrandCollection()
new FormatsCollection()
new HeroModelCollection()
new CupSectionCollection()
