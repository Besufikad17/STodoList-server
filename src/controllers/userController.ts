import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

const prisma = new PrismaClient();

class UserController {
  public signup = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.json({
        success: false,
        data: null,
        error: { msg: "Please enter all fields!!" },
      });
    }

    try {
      let salt: string = await bcrypt.genSalt(10);
      let pwd: string = await bcrypt.hash(password, salt);

      const user = await prisma.user.create({
        data: {
          email,
          username,
          password: pwd,
          todos: {},
        },
      });

      jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET || "secret",
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({
            success: true,
            data: {
              token,
              user,
            },
            error: null,
          });
        }
      );
    } catch (error) {
      console.log(error);

      return res.json({
        success: false,
        data: null,
        error: error,
      });
    }
  };

  public login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({
        success: false,
        data: null,
        error: { msg: "Please enter fields!!" },
      });
    }

    try {
      const user = await prisma.user.findMany({
        where: {
          username,
        },
      });

      bcrypt.compare(password, user[0].password).then((result) => {
        if (result) {
          jwt.sign(
            { user },
            process.env.JWT_SECRET || "secret",
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              let userInfo = {
                user: user,
                token: token,
              };
              res.json(userInfo);
            }
          );
        } else {
          return res.json({
            success: false,
            data: null,
            error: { msg: "Invalid credentials!!" },
          });
        }
      });
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        data: null,
        error: error,
      });
    }
  };

  public getTodosById = async (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;

    if (!id) {
      return res.json({
        success: false,
        data: null,
        error: { msg: "Please enter all fields!!" },
      });
    }

    try {
      const user = await prisma.user.findMany({
        where: {
          id,
        },
      });

      res.json({
        success: true,
        data: user[0].todos,
        error: null,
      });
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        data: null,
        error: error,
      });
    }
  };

  public updateTodo = async (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;

    const { todos } = req.body;

    if (!id || !todos) {
      return res.json({
        success: false,
        data: null,
        error: { msg: "Please enter all fields!!" },
      });
    }

    try {
      const user = await prisma.user.update({
        where: {
          id,
        },
        data: {
          todos,
        },
      });

      res.json({
        success: true,
        data: user.todos,
        error: null,
      });
    } catch (error) {
      console.log(error);

      return res.json({
        success: false,
        data: null,
        error: error,
      });
    }
  };

  public exportTodo = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id) {
      return res.json({
        success: false,
        data: null,
        error: { msg: "Please enter all fields!!" },
      });
    }

    try {

        const user = await prisma.user.findMany({
            where: {
                id
            }
        })

        fs.writeFile("dist/controllers/export.json", JSON.stringify(user[0].todos) , 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
        
            console.log("JSON file has been saved.");
        });
        console.log(__dirname+ '/export.json');
        // FIXME
        res.sendFile(__dirname + '/export.json');
    }catch (error) {
        console.log(error);
        return res.json({
          success: false,
          data: null,
          error: error,
        });
      }
  };
}

export { UserController };
