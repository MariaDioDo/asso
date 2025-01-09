<template>
  <footer class="footer">
    <div class="footer-section">
      <!-- Redes Sociales -->
      <div class="social-media">
        <div class="logo-container">
          <img src="@/assets/images/logo.jpg" alt="Logo" class="logo">
        </div>
        <h3>Conéctate con nosotros</h3>
        <div class="icons">
          <a href="#"><i class="fab fa-facebook"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-youtube"></i></a>
          <a href="#"><i class="fab fa-whatsapp"></i></a>
        </div>
      </div>

      <!-- Otras Páginas -->
      <div class="links">
        <h3>Enlaces útiles</h3>
        <ul>
          <li><a href="#">Acerca de nosotros</a></li>
          <li><a href="#">Servicios</a></li>
          <li><a href="#">Noticias</a></li>
          <li><a href="#">Contacto</a></li>
        </ul>
      </div>

      <!-- Contacto -->
      <div class="contact">
        <h3>Contáctanos</h3>
        <p><i class="fas fa-phone"></i> 722-754-0072</p>
        <p><i class="fas fa-envelope"></i> promocionDepo@uaemex.mx</p>
        <p>
          <i class="fas fa-map-marker-alt"></i>
          Cerro de Coatepec S/N, Ciudad Universitaria, Universitaria, 50110 Toluca de Lerdo, Méx.
        </p>
      </div>
    </div>

    <!-- Footer inferior -->
    <div class="footer-bottom">
      <p>©2024 promocionDeportivaUAEMex. Todos los derechos reservados.</p>
      <div class="legal-links">
        <a href="#">Política de privacidad</a>
        <a href="#">Política de Cookies</a>
        <a href="#">Aviso Legal</a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
};
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #1e1e1e, #333);
  color: #ffffff;
  padding: 40px 20px;
  font-family: 'Roboto', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer-section {
  display: flex;
  justify-content: space-between;
  text-align: center;
  gap: 30px;
  flex-wrap: wrap;
  max-width: 1200px;
  width: 100%;
}

.social-media,
.links,
.contact {
  width: 30%;
  padding: 15px;
  min-width: 250px;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.logo {
  max-width: 100px;
  height: auto;
}

.social-media h3,
.links h3,
.contact h3 {
  margin-bottom: 15px;
  font-size: 1.5em;
  font-weight: 600;
  color: #4caf50;
}

.icons a {
  margin: 0 15px;
  color: #4caf50;
  font-size: 2.5em;
  transition: transform 0.3s ease, color 0.3s ease;
}

.icons a:hover {
  transform: scale(1.2);
  color: #81c784;
}

.links ul {
  list-style: none;
  padding: 0;
}

.links li a {
  color: #ffffff;
  text-decoration: none;
  font-size: 1em;
  display: block;
  margin-bottom: 8px;
  transition: color 0.3s ease;
}

.links li a:hover {
  color: #4caf50;
  text-decoration: underline;
}

.contact p {
  margin: 8px 0;
  font-size: 1em;
  text-align: left;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 10px;
  font-size: 0.9em;
  flex-wrap: wrap;
  max-width: 1200px;
  width: 100%;
}

.footer-bottom p {
  margin: 0;
  text-align: center;
  font-size: 1em;
}

.legal-links {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.legal-links a {
  color: #81c784;
  font-size: 1em;
  text-decoration: none;
  transition: color 0.3s ease;
}

.legal-links a:hover {
  color: #4caf50;
}

i {
  margin-right: 8px;
}

.footer-bottom {
  border-top: 1px solid #4caf50;
  padding-top: 1px;
  padding-bottom: 1px;
}

@media (max-width: 768px) {
  .footer-section {
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }

  .social-media,
  .links,
  .contact {
    width: 100%;
    text-align: center;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .logo {
    max-width: 120px;
  }
}
</style>
