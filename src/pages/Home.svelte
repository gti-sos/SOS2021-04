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
      Row,
    } from "sveltestrap";
  </script>
  
  <main>
    <h1>SOS2021-04</h1>
  
    <h2>Componentes</h2>
    <Container>
      <Col>
        <a href="https://github.com/mangonreg">Manuel González Regadera</a>
      </Col>
      <Col>
        <a href="https://github.com/JavierCarmona16">Javier Carmona Andrés</a>
      </Col>
      <Col>
        <a href="https://github.com/migueclon98">Miguel Gómez Vázquez</a>
      </Col>
    </Container>
    <p />
    <h2>Descripción del proyecto</h2>
    <p>
        Relación entre tasa de alfabetización, gasto público en educación e índice de pobreza en diversos países por años
        ¿Podría un incremento del gasto educativo de un país reducir los índices de analfabetismo de su población? ¿Existe
        una relación directa entre la pobreza y la falta de estudios?
    </p>
  
    <Container>
      <Col>
        <a href="http://github.com/gti-sos/SOS2021-04"
          ><b>Repositorio: </b>http://github.com/gti-sos/SOS2021-04</a
        >
      </Col>
      <Col>
        <a href="http://sos2021-04.herokuapp.com"
          ><b>Enlace: </b>http://sos2021-04.herokuapp.com</a
        >
      </Col>
    </Container>
    <p />
  
    <a href="/#/info">
      <Button color="primary">Info</Button>
    </a>
  
    <p />
  
    <h2>API's</h2>
    <Container>
      <Col xs="auto">
        <Card class="mb-3">
          <CardHeader>
            <CardTitle><h5>Gastos en Educación</h5></CardTitle>
          </CardHeader>
          <CardBody>
            <CardSubtitle />
            <CardText>
               El Gasto Público en Educación es aquel que destina el Gobierno a instituciones educativas, administración educativa y subsidios para estudiantes
               y otras entidades privadas a lo largo de un año.
               </CardText>

            <a href="https://sos2021-04.herokuapp.com/api/v1/education_expenditures">
              <Button color="primary">API v1</Button></a>
            <a href="/#/education_expenditures">
              <Button color="primary">Interfaz</Button>
            </a>
            <a href="https://documenter.getpostman.com/view/14947441/TzJsexSA"
              ><Button color="info">Documentación v1</Button></a>
              <a href="/#/edex_graphs">
                <Button color="primary">Graficas</Button>
              </a>
          
          
            </CardBody>

          <CardFooter
            >desarrollado por
            <a href="https://github.com/mangonreg">Manuel González Regadera</a>
          </CardFooter>
        </Card>

      </Col>
      <Col xs="auto">
        <Card class="mb-3">
          <CardHeader>
            <CardTitle><h5>Riegos de pobreza</h5></CardTitle>
          </CardHeader>
          <CardBody>
            <CardSubtitle />
            <CardText>
               La tasa de riesgo de pobreza es el porcentaje de población
               que se encuentra por debajo del umbral de riesgo de pobreza.
               El umbral de la pobreza, son los ingresos por debajo de los cuales
               se considera que una persona o familia está en riesgo de pobreza.</CardText>

            <a href="https://sos2021-04.herokuapp.com/api/v1/poverty_risks">
              <Button color="primary">API v1</Button>
            </a>
            <a href="/#/poverty_risks">
              <Button color="primary">Interfaz</Button>
            </a>
            <a href="https://documenter.getpostman.com/view/14968173/TzJu8we5">
              <Button color="info">Documentación v1</Button>
            </a>
          </CardBody>
          <CardFooter
            >desarrollado por
            <a href="https://github.com/JavierCarmona16">Javier Carmona Andrés</a>
          </CardFooter>
        </Card>
      </Col>

      <Col xs="auto">
        <Card class="mb-3">
          <CardHeader>
            <CardTitle><h5>Analfabetismo</h5></CardTitle>
          </CardHeader>
          <CardBody>
            <CardSubtitle />
            <CardText>
              Expresa la magnitud relativa de la población analfabeta.
            </CardText>
            <a href="/api/v1/illiteracy"><Button color="primary">API v1</Button></a>

            <a href="/#/illiteracy"><Button color="primary">Interfaz</Button></a>

            <a href="https://documenter.getpostman.com/view/14948423/TzJsfJT1"><Button color="info">Documentación v1</Button></a>
          </CardBody>
          <CardFooter
            >Desarrollado por
            <a href="https://github.com/migueclon98">Miguel Gómez Vázquez</a
            ></CardFooter
          >
        </Card>
      </Col>
    </Container>
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
    b {
      color: #00c1ff;
    }
    @media (min-width: 640px) {
      main {
        max-width: none;
      }
    }
  </style>