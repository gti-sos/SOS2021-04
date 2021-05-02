<script>
    import {
        Button
      } from "sveltestrap";
    </script>
    
    <main>
    <tr>
        <td>
            <h1>404 - Not Found</h1>
            <p>La página que está buscando no está disponible</p>
            <a href="/">
            <Button color="success">Volver a la página principal</Button></a>
        </td>
        <td>
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img src="images/notfoundtobot.jpg" alt="not found image" />
        </td>
    
    </tr>
    </main>
    
    <style>
    main{
        text-align: center;
        padding: 4.5%;
        margin-left: 18%;
    }
    
    h1{
        color: red;
    }
      
    </style>