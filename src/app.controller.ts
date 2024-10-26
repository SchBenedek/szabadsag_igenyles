import { Controller, Get, Render, Redirect, Req, Res, Body, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Adatok } from './Adatok.dto';
import { Response} from 'express';
import { error } from 'console';

@Controller()
export class AppController {
  #Adatok:Adatok[]=[];

  constructor(private readonly appService: AppService) {}

  @Get("")
  @Render('index')
  getHello() {
    return {
      data:{},
      errors:[]
    };
  }

  @Post("megadas")
  megadas(
    @Body() Adatok:Adatok,
    @Res() response:Response
  ){
    console.log(Adatok);
    let errors=[];

    if(!Adatok.nev||!Adatok.kezdo_datum||!Adatok.veg_datum||!Adatok.azonosito||!Adatok.indoklas)
    {
      errors.push("Minden mezőt ki kell tölteni!");
    }
    if(Adatok.veg_datum<Adatok.kezdo_datum)
    {
      errors.push("Vég dátum nem lehet korábban, mint a kezdő dátum!");
    }
    if(!/^[A-Z]{3}-\d{3}$/.test(Adatok.azonosito))
    {
      errors.push("Nem megfelelő azonosító formátum!");
    }
    if(Adatok.indoklas.length<=30)
    {
      errors.push("Indoklás legalább 30 karakter!")
    }
    if(errors.length>0)
    {
      response.render("index", {
        data:Adatok,
        errors
      });
      return
    }
    const Megadas:Adatok={
      nev:Adatok.nev,
      kezdo_datum:Adatok.kezdo_datum,
      veg_datum:Adatok.veg_datum,
      fizetett:Adatok.fizetett,
      azonosito:Adatok.azonosito,
      indoklas:Adatok.indoklas
    }
    this.#Adatok.push(Megadas);
    console.log(this.#Adatok);
    return response.redirect("/sikeres");
  }

  @Get("sikeres")
  @Render("sikeres")
  rsikeres(){
    return
  }

  @Post("vissza")
  vissza(@Res() response:Response){
    return response.redirect("/");
  }
}
