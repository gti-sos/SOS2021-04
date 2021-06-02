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
    <h1>Integrations</h1>
  </div>
  <div>
    <Card class="mb-3">
      <CardHeader>
        <CardTitle><h2>Education expenditure</h2></CardTitle>
      </CardHeader>
      <CardBody>
        <CardSubtitle />
        <CardText />
        <a href="/#/integrations/edex/api1">
          <Button color="primary">Gastos en educacion - Gastos en financiación</Button>
          </a>

          <a href="/#/integrations/edex/api2">
            <Button color="primary">Gastos en educacion - Gastos en sanidad</Button>
            </a>

            <a href="/#/integrations/edex/api3">
              <Button color="primary">Gastos en educacion - Gastos en turismo</Button>
              </a>
      
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
        <a href="/#/povertyRisks_USO_ParqueMovil">
          <Button color="primary">Uso API Parque Móvil</Button>
          </a>
          <a href="/#/povertyRisks_USO_NacimientosMadrid">
            <Button color="primary">Uso API Fisioterapeutas</Button>
          </a>
        <a href="/#/povertyRisks_natalityStats">
        <Button color="primary">Integración con natality-stats (con proxy)</Button>
        </a>
        <a href="/#/povertyRisks_drugUse">
        <Button color="primary">Integración con drug-use (con proxy)</Button>
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
        <a href="/#/integrations/api1"
          ><Button color="primary"> API Externa 1 USO</Button></a
        >
        <a href="/#/integrations/api2"
          ><Button color="primary"> API Externa 2 USO</Button></a
        >
        <a href="/#/integrations/api3"
        ><Button color="primary"> API Externa 3 USO</Button></a
      >
        <a href="/#/integrations/mig-obesity-Stats"
          ><Button color="primary"> API Obesity-Stats G10</Button></a
        >
        <a href="/#/integrations/mig-temperature"
          ><Button color="primary"> API Temperature-Stats G21</Button></a
        >
       
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