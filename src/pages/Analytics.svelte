<script>
    import {
      Button,
      Icon,
      Card,
      CardBody,
      CardFooter,
      CardHeader,
      CardSubtitle,
      CardText,
      CardTitle,
      Col,
      Container,
      Nav,
      NavItem,
      NavLink,
      Row,
    } from "sveltestrap";
  </script>
  
  <main>
    <Nav>
      <NavItem>
        <NavLink href="/">Volver</NavLink>
      </NavItem>
    </Nav>
  
    <div>
    <h1>Analytics de nuestras propias APIs </h1>
    <h3>con highCharts y nuestra Biblioteca Personal</h3>
  </div>
  <div>
    <Card class="mb-3">
      <CardHeader>
        <CardTitle><h2>Education expenditure</h2></CardTitle>
      </CardHeader>
      <CardBody>
        <CardSubtitle />
        <CardText />
      
      </CardBody>
    </Card>
  </div>
  <div>
    <Card class="mb-3">
      <CardHeader>
        <CardTitle><h2>Poverty risks</h2></CardTitle>
      </CardHeader>
      <CardBody>
        <CardSubtitle />
        <CardText />
        
        <a href="/#/povertyrisks_graphs">
          <Button color="primary">Mi gráfica (highCharts)</Button>
          </a>
        <a href="/#/povertyrisks_graphs">
          <Button color="primary">Mi gráfica (ApexCharts)</Button>
        </a>
      
      </CardBody>
    </Card>
  </div>
  <div>
    <Card class="mb-3">
      <CardHeader>
        <CardTitle><h2>lliteracy-Stats</h2></CardTitle>
      </CardHeader>
      <CardBody>
        <CardSubtitle />
        <CardText />
        <a href="/#/illiteracy_graphs">
            <Button color="primary">Graficas highCharts</Button>
            <a href="/#/illiteracy_graphs2"><Button color="primary">Grafica JSCharting</Button></a>
       
      </CardBody>
    </Card>
  </div>
  </main>
  
  <style>
     main {
      text-align: center;
      padding: 1em;
      max-width: 240px;
      margin: 0 auto;
    }
    h1 {
      color: #ff3e00;
      text-transform: uppercase;
      font-size: 4em;
      font-weight: 100;
    }
    h3 {
      color: #ff3e00;
    }
    div{
      margin-bottom: 15px;
    }
    /*b {
      color: #00c1ff;
    }*/
    @media (min-width: 640px) {
      main {
        max-width: none;
      }
    }
  </style>