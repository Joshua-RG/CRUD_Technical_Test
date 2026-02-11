import { Router } from 'express';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/products.controller.js';

const router = Router();

router.get('/', getProducts);      
router.post('/', createProduct);   
router.put('/:id', updateProduct); 
router.delete('/:id', deleteProduct); 

export default router;