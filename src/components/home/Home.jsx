import React from 'react'
import { useTranslation } from 'react-i18next';

const Home = () => {
   const { t } = useTranslation();
  return (
    <div className="container py-4">
    
    <div className="text-center mb-5">
      <h1 className="display-4 fw-bold">✨ {t('Welcom')}✨</h1>
      <hr />
    </div>
  
    
    <div className="row g-4">
     
      <div className="col-sm-12 col-md-6 col-lg-4">
        <div className="card h-100 d-flex flex-column">
          <div className="card-header text-center fw-bold">🛋️ MOBILIER !</div>
          <div className="card-body">
            <p>📢 Transformez votre intérieur avec style et élégance !</p>
            <p>🔥 Offres spéciales limitées :</p>
            <ul>
              <li>✅ -30% sur les tables à manger 🍽️</li>
              <li>✅ Livraison offerte dès 300$ d'achat 🚚</li>
              <li>✅ 2 chaises achetées = 1 offerte 🪑</li>
            </ul>
          </div>
        </div>
      </div>
  
     
      <div className="col-sm-12 col-md-6 col-lg-4">
        <div className="card h-100 d-flex flex-column">
          <div className="card-header text-center fw-bold">🧊 ÉLECTROMÉNAGER !</div>
          <div className="card-body">
            <p>🧊 Réfrigérateurs ultra-performants</p>
            <p>🔥 Offres spéciales :</p>
            <ul>
              <li>✅ Jusqu’à -50% sur une sélection de produits 🛒</li>
              <li>✅ Paiement en 4x sans frais disponible 💳</li>
              <li>✅ Livraison offerte dès 300$ d’achat 🚚</li>
            </ul>
          </div>
        </div>
      </div>
  
     
      <div className="col-sm-12 col-md-6 col-lg-4">
        <div className="card h-100 d-flex flex-column">
          <div className="card-header text-center fw-bold">💻 HIGH-TECH !</div>
          <div className="card-body">
            <p>💻 PC Portables & Accessoires</p>
            <p>🔥 Offres spéciales :</p>
            <ul>
              <li>✅ Jusqu'à -40% sur une sélection de produits 💰</li>
              <li>✅ Smartphone offert pour tout achat d’un PC Gamer 🎁</li>
              <li>✅ Livraison EXPRESS dès 200$ d’achat 🚚</li>
            </ul>
          </div>
        </div>
      </div>
  
      
      <div className="col-sm-12 col-md-6 col-lg-4">
        <div className="card h-100 d-flex flex-column">
          <div className="card-header text-center fw-bold">🌿 COSMÉTIQUE !</div>
          <div className="card-body">
            <p>🌿 Soins Visage & Corps</p>
            <p>🔥 Offres spéciales :</p>
            <ul>
              <li>✅ Jusqu'à -40% sur une sélection de produits 💰</li>
              <li>✅ 1 produit offert dès 2 articles achetés 🎁</li>
              <li>✅ Livraison EXPRESS dès 200$ d’achat 🚚</li>
            </ul>
          </div>
        </div>
      </div>
  
     
      <div className="col-sm-12 col-md-6 col-lg-4">
        <div className="card h-100 d-flex flex-column">
          <div className="card-header text-center fw-bold">🏗️ MATÉRIAUX DE CONSTRUCTION !</div>
          <div className="card-body">
            <p>🏠 Matériaux & Équipements</p>
            <p>🔥 Offres spéciales :</p>
            <ul>
              <li>✅ Jusqu'à -30% sur une sélection de matériaux 🧱</li>
              <li>✅ 1 sac de ciment offert pour 10 achetés 🎁</li>
              <li>✅ Livraison EXPRESS dès 500$ d’achat 🚚</li>
            </ul>
          </div>
        </div>
      </div>
  
      
      <div className="col-sm-12 col-md-6 col-lg-4">
        <div className="card h-100 d-flex flex-column">
          <div className="card-header text-center fw-bold">🧸 JOUETS !</div>
          <div className="card-body">
            <p>🎮 Jeux éducatifs, peluches et bien plus !</p>
            <p>🔥 Offres spéciales :</p>
            <ul>
              <li>✅ Jusqu'à -50% sur une sélection de jouets 💰</li>
              <li>✅ 1 jouet offert dès 3 articles achetés 🎁</li>
              <li>✅ Livraison EXPRESS offerte dès 150$ d’achat 🚚</li>
            </ul>
          </div>
        </div>
      </div>
  
     
      <div className="col-sm-12 col-md-6 col-lg-4">
        <div className="card h-100 d-flex flex-column">
          <div className="card-header text-center fw-bold">👕 TEXTILE !</div>
          <div className="card-body">
            <p>👗 Mode pour tous les styles</p>
            <p>🔥 Offres spéciales :</p>
            <ul>
              <li>✅ -20% sur la collection printemps 🌸</li>
              <li>✅ 1 t-shirt offert pour 2 achetés 🎁</li>
              <li>✅ Livraison gratuite dès 100$ d'achat 🚚</li>
            </ul>
          </div>
        </div>
      </div>
  
    
      <div className="col-sm-12 col-md-6 col-lg-4">
        <div className="card h-100 d-flex flex-column">
          <div className="card-header text-center fw-bold">🥖 ALIMENTAIRE !</div>
          <div className="card-body">
            <p>🍎 Produits frais & bio</p>
            <p>🔥 Offres spéciales :</p>
            <ul>
              <li>✅ 2 achetés = 1 offert sur les snacks 🎁</li>
              <li>✅ Jusqu’à -25% sur les paniers fruits 🍇</li>
              <li>✅ Livraison express sous 24h 🚚</li>
            </ul>
          </div>
        </div>
      </div>
  
     
      <div className="col-sm-12 col-md-6 col-lg-4">
        <div className="card h-100 d-flex flex-column">
          <div className="card-header text-center fw-bold">🔌 BUREAUTIQUE !</div>
          <div className="card-body">
            <p>📱 Gadgets & accessoires high-tech</p>
            <p>🔥 Offres spéciales :</p>
            <ul>
              <li>✅ Jusqu’à -35% sur les écouteurs 🎧</li>
              <li>✅ Batterie externe offerte dès 2 accessoires achetés 🔋</li>
              <li>✅ Livraison gratuite dès 150$ d’achat 🚚</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  )
}

export default Home