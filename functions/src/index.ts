import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'; // Adicionado Payment
import axios from 'axios';

admin.initializeApp();

// --- CONFIGURAÇÕES ---
const MP_ACCESS_TOKEN = "APP_USR-6856504404106293-120416-60f1960382878dacb6ce2f7b9df0785a-434027587"; // 🔴 CONFIRA SEU TOKEN
const MELHOR_ENVIO_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NTYiLCJqdGkiOiJlMDk5YjVjOTQ4YTg5NzExZDg1MGFmZGRiZmRkZjg4Mzg2MGU5ZTQ3MmU2OTQ2MzE3Y2JjODNhOGM4MGMzMjQwZTIzZjBmZDY4OWE3MDU4ZiIsImlhdCI6MTc3MDU4Mjc2MC4xNDI5NSwibmJmIjoxNzcwNTgyNzYwLjE0Mjk1MywiZXhwIjoxODAyMTE4NzYwLjEzNDYxNiwic3ViIjoiYTEwODVmZGItNWU5OS00YTg4LWI5ZTktYjc2ZmZiMzRiZjRiIiwic2NvcGVzIjpbImNhcnQtcmVhZCIsImNhcnQtd3JpdGUiLCJjb21wYW5pZXMtcmVhZCIsImNvbXBhbmllcy13cml0ZSIsImNvdXBvbnMtcmVhZCIsImNvdXBvbnMtd3JpdGUiLCJub3RpZmljYXRpb25zLXJlYWQiLCJvcmRlcnMtcmVhZCIsInByb2R1Y3RzLXJlYWQiLCJwcm9kdWN0cy1kZXN0cm95IiwicHJvZHVjdHMtd3JpdGUiLCJwdXJjaGFzZXMtcmVhZCIsInNoaXBwaW5nLWNhbGN1bGF0ZSIsInNoaXBwaW5nLWNhbmNlbCIsInNoaXBwaW5nLWNoZWNrb3V0Iiwic2hpcHBpbmctY29tcGFuaWVzIiwic2hpcHBpbmctZ2VuZXJhdGUiLCJzaGlwcGluZy1wcmV2aWV3Iiwic2hpcHBpbmctcHJpbnQiLCJzaGlwcGluZy1zaGFyZSIsInNoaXBwaW5nLXRyYWNraW5nIiwiZWNvbW1lcmNlLXNoaXBwaW5nIiwidHJhbnNhY3Rpb25zLXJlYWQiLCJ1c2Vycy1yZWFkIiwidXNlcnMtd3JpdGUiLCJ3ZWJob29rcy1yZWFkIiwid2ViaG9va3Mtd3JpdGUiLCJ3ZWJob29rcy1kZWxldGUiLCJ0ZGVhbGVyLXdlYmhvb2siXX0.N97U4eF3XGuxzww1H-NWYjOiqFjB8mlyUH5YiFEK91MjGOgrRy7_Kdeu-fzrN8RsIIvwbB4INHGt2-7m6DYhjXUglEAc8UGv-PRhOrxUC9QOF8rcnolTVckD_sdOKU8MNw-Gtfpqd5_ri3hoatWwV_h51YkaDFoGCg6K27cTq2ESIMvmucohG8lluHxdAnxbSOARZJ_oEp0293QD6BV2jJfcfWnIdkAdsD14yfirTzPU35_BNsKI-BDt13isM53dR4wCtL2gu9n5oCeW1DpdXamw_Pz3qiJEothlwcJvsHxr3o220THKC_aeNzS137B4LyUhe8A6CwyeVpOErPZ9hsa_rJIAwbcEhF23YHQ_AmEEK7zGr8rbmemCxNm-uKw5Dpge3-yv-bg_OV6FnnRqZAY67JAzw1E_L77dOb-W3ZsvYUeUPp3bd6zhdmfv5zy6J6Ig0eXg4SQ7SW1DEJa8VfXFEzNalZFx8nZF4d7rB8EC2y8hC91BGpbCqHWuAyyZksAkQoJiZuz03dB5r7ytXbkEFlNHLHL-VYpwxm_zHYeyZdqlOUFNcgg8pv4bzUEHGQmUC04A00P51P_k-jrIOynaRdE3GyA3-mi_eHGmn-6EVnoe5TfGte8Yk3bH_mCmYGLuy1tP922sDd5hs7QFRufd0QLfCSbn6I1SkPAgIkg"; // 🔴 CONFIRA SEU TOKEN
const FROM_CEP = "78559-999"; // 🔴 CONFIRA SEU CEP

const IS_SANDBOX = true; 
const ME_URL = IS_SANDBOX 
  ? "https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate"
  : "https://melhorenvio.com.br/api/v2/me/shipment/calculate";

const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });

// --- FUNÇÃO 1: CALCULAR FRETE (Mantida igual) ---
export const calculateShipping = functions.https.onCall(async (request) => {
  const data = request.data;
  const { destinationZip, items } = data;

  if (!destinationZip || !items) throw new functions.https.HttpsError("invalid-argument", "Dados faltando.");

  try {
    const db = admin.firestore();
    const productsToShip = [];

    for (const item of items) {
      const docRef = db.collection('products').doc(item.productId);
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        const p = docSnap.data();
        for (let i = 0; i < item.quantity; i++) {
          productsToShip.push({
            id: item.productId,
            width: p?.width || 20,
            height: p?.height || 5,
            length: p?.length || 25,
            weight: (p?.weight || 300) / 1000,
            insurance_value: p?.price || 0,
            quantity: 1
          });
        }
      }
    }

    const response = await axios.post(
      ME_URL,
      {
        from: { postal_code: FROM_CEP },
        to: { postal_code: destinationZip },
        products: productsToShip,
        options: { receipt: false, own_hand: false }
      },
      {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${MELHOR_ENVIO_TOKEN}`,
          "User-Agent": "SRSportline/1.0 (suporte@webuildbr.com.br)"
        }
      }
    );

    return response.data
      .filter((opt: any) => !opt.error)
      .map((opt: any) => ({
        id: opt.id,
        name: opt.name,
        price: Number(opt.price),
        delivery_time: opt.delivery_time,
        company: opt.company.name,
        picture: opt.company.picture
      }));

  } catch (error: any) {
    console.error("Erro ME:", error.response?.data || error.message);
    throw new functions.https.HttpsError("internal", "Erro no cálculo de frete.");
  }
});

// --- FUNÇÃO 2: CHECKOUT (Atualizada com Metadados) ---
export const createCheckoutSession = functions.https.onCall(async (request) => {
  const { items, buyer, shippingCost } = request.data;

  try {
    const db = admin.firestore();
    const mpItems = [];
    // Vamos salvar um resumo do pedido para recuperar no Webhook
    const orderMetadata = [];

    for (const item of items) {
      const docRef = db.collection('products').doc(item.productId);
      const docSnap = await docRef.get();
      const productData = docSnap.data();

      // Encontra a variante
      const variant = productData?.variants.find((v: any) => 
         v.id === item.variantId || v.sku === item.variantId || v.size === item.variantId 
      );

      // Valida estoque
      if (variant && variant.stock < item.quantity) {
          throw new functions.https.HttpsError("failed-precondition", `Estoque insuficiente.`);
      }

      // Adiciona aos metadados (para dar baixa no estoque depois)
      orderMetadata.push({
          id: item.productId,
          variantSku: variant ? variant.sku : null,
          variantSize: variant ? variant.size : null,
          quantity: item.quantity
      });

      mpItems.push({
        id: item.productId,
        title: `${productData?.name} - ${variant?.size || 'UN'}`,
        description: productData?.description?.substring(0, 200),
        picture_url: productData?.images[0],
        quantity: item.quantity,
        currency_id: 'BRL',
        unit_price: Number(productData?.price)
      });
    }

    const preference = new Preference(client);
    const body = {
      items: mpItems,
      payer: {
        name: buyer.name,
        email: buyer.email,
        phone: { area_code: buyer.phone.slice(0,2), number: buyer.phone.slice(2) },
        identification: { type: "CPF", number: buyer.cpf.replace(/\D/g, "") },
        address: {
          zip_code: buyer.address.zip_code,
          street_name: buyer.address.street_name,
          street_number: String(buyer.address.street_number),
          neighborhood: buyer.address.neighborhood,
          city: buyer.address.city,
          federal_unit: buyer.address.federal_unit
        }
      },
      shipments: { cost: shippingCost, mode: "not_specified" },
      back_urls: {
        success: "https://sr-sportline-site-prod.web.app/sucesso",
        failure: "https://sr-sportline-site-prod.web.app/erro",
        pending: "https://sr-sportline-site-prod.web.app/pendente"
      },
      auto_return: "approved",
      metadata: {
          // O Mercado Pago converte tudo para string nos metadados, então usamos JSON
          order_items: JSON.stringify(orderMetadata),
          customer_email: buyer.email
      },
      notification_url: "https://us-central1-sr-sportline-site-prod.cloudfunctions.net/receiveWebhook" 
    };

    // @ts-ignore
    const result = await preference.create({ body });
    return { url: result.init_point, sandbox_url: result.sandbox_init_point };

  } catch (error: any) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// --- FUNÇÃO 3: WEBHOOK (O Robô de Estoque) ---
export const receiveWebhook = functions.https.onRequest(async (req, res) => {
    const { type, data } = req.body; // ou req.query dependendo da versão da notificação

    // Só nos interessa se for notificação de pagamento
    if (type === 'payment' || req.body.action === 'payment.created') {
        try {
            const paymentId = data?.id || req.body.data?.id;
            if (!paymentId) { res.status(200).send("No ID"); return; }

            // 1. Consultar status atualizado no Mercado Pago
            const paymentClient = new Payment(client);
            const paymentInfo = await paymentClient.get({ id: paymentId });

            // 2. Se estiver APROVADO, processar o pedido
            if (paymentInfo.status === 'approved') {
                const db = admin.firestore();
                const orderId = paymentInfo.external_reference || String(paymentId);
                
                // Verificar se já salvamos esse pedido para não duplicar
                const orderRef = db.collection('orders').doc(orderId);
                const orderDoc = await orderRef.get();

                if (!orderDoc.exists) {
                    // A. Salvar Pedido no Banco
                    await orderRef.set({
                        mp_id: paymentId,
                        status: 'approved',
                        amount: paymentInfo.transaction_amount,
                        customer: paymentInfo.payer,
                        created_at: new Date().toISOString(),
                        items: paymentInfo.metadata.order_items ? JSON.parse(paymentInfo.metadata.order_items) : []
                    });

                    // B. Dar Baixa no Estoque (Transaction)
                    if (paymentInfo.metadata.order_items) {
                        const items = JSON.parse(paymentInfo.metadata.order_items);
                        
                        await db.runTransaction(async (transaction) => {
                            for (const item of items) {
                                const productRef = db.collection('products').doc(item.id);
                                const productDoc = await transaction.get(productRef);
                                
                                if (productDoc.exists) {
                                    const productData = productDoc.data();
                                    const newVariants = productData?.variants.map((v: any) => {
                                        // Acha a variante pelo SKU ou Tamanho e diminui o estoque
                                        if (v.sku === item.variantSku || v.size === item.variantSize) {
                                            return { ...v, stock: Math.max(0, v.stock - item.quantity) };
                                        }
                                        return v;
                                    });
                                    transaction.update(productRef, { variants: newVariants });
                                }
                            }
                        });
                        console.log("✅ Estoque atualizado!");
                    }
                }
            }
        } catch (error) {
            console.error("Erro Webhook:", error);
        }
    }
    
    // Sempre responder 200 OK para o Mercado Pago não ficar reenviando
    res.status(200).send("OK");
});