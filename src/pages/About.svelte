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
    <h1>Enlace a los Videos </h1>
    
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
            <a href="https://youtu.be/9uS1fNT95OA"><Button color="primary">Video de Miguel Gómez Vázquez</Button></a>
       
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