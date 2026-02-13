import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../services/firebase/config';
import type { Product } from '../types/product';

export const useProductBySlug = (slug: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Se não tiver slug (ex: carregando rota), não faz nada
    if (!slug) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Cria a busca: "Me dê o produto onde o campo 'slug' é igual ao da URL"
        const q = query(
          collection(db, 'products'), 
          where('slug', '==', slug),
          limit(1)
        );

        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          // Pega o primeiro (e único) documento encontrado
          const docData = snapshot.docs[0].data() as Product;
          // Junta com o ID do documento
          setProduct({ ...docData, id: snapshot.docs[0].id });
        } else {
          setProduct(null); // Nenhum produto com esse slug
        }
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return { product, loading };
};