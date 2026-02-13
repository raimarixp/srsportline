import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface VariantForm {
  size: string;
  stock: string | number;
  sku: string;
}

export const AdminDashboard = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Estados do Produto
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // Estados dos Filtros
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Futebol');
  const [team, setTeam] = useState('');
  const [league, setLeague] = useState('');
  const [continent, setContinent] = useState('');
  const [gender, setGender] = useState('Masculino');

  // 📦 LOGÍSTICA (Campos do Melhor Envio)
  const [weight, setWeight] = useState('300'); // Peso em gramas
  const [height, setHeight] = useState('5');   // Altura em cm
  const [width, setWidth] = useState('20');    // Largura em cm
  const [length, setLength] = useState('25');  // Comprimento em cm

  // Variantes
  const [variants, setVariants] = useState<VariantForm[]>([
    { size: 'P', stock: 10, sku: '' },
    { size: 'M', stock: 10, sku: '' },
    { size: 'G', stock: 10, sku: '' },
    { size: 'GG', stock: 5, sku: '' },
    { size: '39', stock: 0, sku: '' },
    { size: '40', stock: 0, sku: '' },
    { size: '41', stock: 0, sku: '' },
    { size: '42', stock: 0, sku: '' },
  ]);

  if (!isAdmin && user) return <div className="p-10 text-slate-900">Acesso negado.</div>;

  const handleVariantChange = (index: number, field: keyof VariantForm, value: string) => {
    const newVariants = [...variants];
    // @ts-ignore
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Formatar Variantes (Remove as que tem estoque 0)
      const formattedVariants = variants
        .filter(v => Number(v.stock) > 0)
        .map(v => ({
          size: v.size,
          stock: Number(v.stock),
          sku: v.sku || `${brand.substring(0,3)}-${team.substring(0,3)}-${v.size}`.toUpperCase().replace(/\s/g, '')
        }));

      // 2. Montar Objeto
      const productData = {
        name,
        slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        description,
        price: Number(price),
        compare_at_price: oldPrice ? Number(oldPrice) : 0,
        images: [imageUrl],
        
        // Filtros
        brand,
        category,
        team,
        league,
        continent,
        gender,

        // Logística
        weight: Number(weight),
        height: Number(height),
        width: Number(width),
        length: Number(length),
        
        variants: formattedVariants,
        featured: true,
        created_at: new Date().toISOString()
      };

      // 3. Salvar no Firestore
      await addDoc(collection(db, "products"), productData);
      
      alert("✅ Produto cadastrado com sucesso!");
      
      // Limpar campos principais
      setName('');
      setTeam('');
      setDescription('');
      setImageUrl('');
      
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar produto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 pt-28 pb-20">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        
        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Novo Produto</h1>
            <p className="text-slate-500 text-sm">Adicione itens ao catálogo da loja.</p>
          </div>
          <button onClick={() => navigate('/')} className="text-sm font-bold text-brand-blue hover:text-blue-700">Cancelar</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SEÇÃO 1: BÁSICO */}
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="label-admin">Nome do Produto</label>
                <input value={name} onChange={e => setName(e.target.value)} className="input-admin" placeholder="Ex: Camisa Brasil Home 2024" required />
              </div>
              
              <div>
                <label className="label-admin">Preço (R$)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="input-admin" placeholder="0.00" required />
              </div>
               <div>
                <label className="label-admin">Preço "De" (Opcional)</label>
                <input type="number" value={oldPrice} onChange={e => setOldPrice(e.target.value)} className="input-admin" placeholder="Para promoções" />
              </div>

              <div className="md:col-span-2">
                <label className="label-admin">URL da Imagem</label>
                <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="input-admin" placeholder="https://..." required />
              </div>

              <div className="md:col-span-2">
                <label className="label-admin">Descrição</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  className="input-admin h-32"
                  placeholder="Detalhes técnicos, material, história do produto..."
                />
              </div>
            </div>
          </section>

          {/* SEÇÃO 2: LOGÍSTICA */}
          <section className="bg-slate-50 p-6 rounded-xl border border-slate-200">
             <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">📦 Logística (Melhor Envio)</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div>
                 <label className="label-admin">Peso (g)</label>
                 <input type="number" className="input-admin bg-white" value={weight} onChange={e => setWeight(e.target.value)} />
               </div>
               <div>
                 <label className="label-admin">Altura (cm)</label>
                 <input type="number" className="input-admin bg-white" value={height} onChange={e => setHeight(e.target.value)} />
               </div>
               <div>
                 <label className="label-admin">Largura (cm)</label>
                 <input type="number" className="input-admin bg-white" value={width} onChange={e => setWidth(e.target.value)} />
               </div>
               <div>
                 <label className="label-admin">Comp. (cm)</label>
                 <input type="number" className="input-admin bg-white" value={length} onChange={e => setLength(e.target.value)} />
               </div>
             </div>
          </section>

          {/* SEÇÃO 3: FILTROS */}
          <section>
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Categorização</h3>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                 <div>
                   <label className="label-admin">Categoria</label>
                   <select value={category} onChange={e => setCategory(e.target.value)} className="input-admin">
                     <option>Futebol</option>
                     <option>Basquete</option>
                     <option>Casual</option>
                   </select>
                 </div>
                 
                 <div>
                   <label className="label-admin">Gênero</label>
                   <select value={gender} onChange={e => setGender(e.target.value)} className="input-admin">
                     <option>Masculino</option>
                     <option>Feminino</option>
                     <option>Unissex</option>
                   </select>
                 </div>

                 <div>
                   <label className="label-admin">Marca</label>
                   <input value={brand} onChange={e => setBrand(e.target.value)} className="input-admin" placeholder="Nike, Adidas..." />
                 </div>

                 <div>
                   <label className="label-admin">Time</label>
                   <input value={team} onChange={e => setTeam(e.target.value)} className="input-admin" placeholder="Flamengo, Lakers..." />
                 </div>

                 <div>
                   <label className="label-admin">Liga</label>
                   <input value={league} onChange={e => setLeague(e.target.value)} className="input-admin" placeholder="Brasileirão, NBA..." />
                 </div>

                 <div>
                   <label className="label-admin">Continente</label>
                   <select value={continent} onChange={e => setContinent(e.target.value)} className="input-admin">
                     <option value="">Nenhum</option>
                     <option>América do Sul</option>
                     <option>Europa</option>
                   </select>
                 </div>
             </div>
          </section>

          {/* SEÇÃO 4: ESTOQUE */}
          <section className="bg-slate-50 p-6 rounded-xl border border-slate-200">
             <h3 className="text-sm font-bold text-slate-900 mb-4">Estoque por Tamanho</h3>
             <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
               {variants.map((v, i) => (
                 <div key={i} className="bg-white p-2 rounded border border-slate-200 text-center">
                   <div className="font-bold text-slate-700 mb-1 text-sm">{v.size}</div>
                   <input 
                    type="number" 
                    placeholder="0" 
                    value={v.stock} 
                    onChange={e => handleVariantChange(i, 'stock', e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-200 text-center p-1 rounded text-sm focus:border-brand-blue outline-none" 
                   />
                 </div>
               ))}
             </div>
          </section>

          <div className="pt-6 border-t border-slate-100">
            <button disabled={loading} className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all shadow-lg flex justify-center items-center">
              {loading ? 'Salvando...' : 'Publicar Produto'}
            </button>
          </div>

        </form>
      </div>

      <style>{`
        .label-admin { display: block; font-size: 0.75rem; font-weight: 700; color: #64748b; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .input-admin { width: 100%; background: #fff; border: 1px solid #cbd5e1; padding: 0.75rem; border-radius: 0.5rem; color: #0f172a; outline: none; transition: all 0.2s; }
        .input-admin:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
      `}</style>
    </div>
  );
};