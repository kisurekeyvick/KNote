/**
 * https://mp.weixin.qq.com/s/EQ1_bEW7ti0xd3AcJHmLyw
 * 
 * 设计模式
 */

/**
 * (1) 创建型模式：用来描述 “如何创建对象”，它的主要特点是 “将对象的创建和使用分离”。
 *     包括单例、原型、工厂方法、抽象工厂和建造者 5 种模式。
 * 
 * (2) 结构型模式：用来描述如何将类或对象按照某种布局组成更大的结构。
 *     包括代理、适配器、桥接、装饰、外观、享元和组合 7 种模式。
 * 
 * (3) 行为型模式：用来识别对象之间的常用交流模式以及如何分配职责。
 *     包括模板方法、策略、命令、职责链、状态、观察者、中介者、迭代器、访问者、备忘录和解释器 11 种模式。
 */

/**
 * - 建造者模式
 * 
 * 需要生成的产品对象有复杂的内部结构，这些产品对象通常包含多个成员属性。
 * 需要生成的产品对象的属性相互依赖，需要指定其生成顺序。
 * 隔离复杂对象的创建和使用，并使得相同的创建过程可以创建不同的产品。
 */
class Car {
  constructor(
    public engine: string,
    public chassis: string, 
    public body: string
  ) {}
}

class CarBuilder {
  engine!: string; // 引擎
  chassis!: string; // 底盘
  body!: string; // 车身

  addChassis(chassis: string) {
    this.chassis = chassis;
    return this;
  }

  addEngine(engine: string) {
    this.engine = engine;
    return this;
  }

  addBody(body: string) {
    this.body = body;
    return this;
  }

  build() {
    return new Car(this.engine, this.chassis, this.body);
  }
}

const car = new CarBuilder()
  .addEngine('v12')
  .addBody('镁合金')
  .addChassis('复合材料')
  .build();

/**
 * - 工厂模式
 * 
 * 工厂模式可以分为：简单工厂模式、工厂方法模式和抽象工厂模式
 */

/**
 * - 简单工厂
 * 
 * 简单工厂模式又叫 静态方法模式，因为工厂类中定义了一个静态方法用于创建对象。
 * 简单工厂让使用者不用知道具体的参数就可以创建出所需的 ”产品“ 类，即使用者可以直接消费产品而不需要知道产品的具体生产细节。
 * 
 * 工厂类负责创建的对象比较少：由于创建的对象比较少，不会造成工厂方法中业务逻辑过于复杂。
 * 客户端只需知道传入工厂类静态方法的参数，而不需要关心创建对象的细节。
 */
abstract class BMW {
  abstract run(): void;
}

class BMW730 extends BMW {
  run(): void {
    console.log("BMW730 发动咯");
  }
}

class BMW840 extends BMW {
  run(): void {
    console.log("BMW840 发动咯");
  }
}

class BMWFactory {
  public static produceBMW(model: "730" | "840"): BMW {
    if (model === "730") {
      return new BMW730();
    } else {
      return new BMW840();
    }
  }
}

const bmw730 = BMWFactory.produceBMW("730");
const bmw840 = BMWFactory.produceBMW("840");

bmw730.run();
bmw840.run();

// 我们定义一个 BMWFactory 类，该类提供了一个静态的 produceBMW() 方法，用于根据不同的模型参数来创建不同型号的车子


/**
 * - 工厂方法
 * 
 * 工厂方法模式（Factory Method Pattern）又称为工厂模式，也叫多态工厂（Polymorphic Factory）模式，它属于类创建型模式。
 * 
 * 在工厂方法模式中，工厂父类负责定义创建产品对象的公共接口，而工厂子类则负责生成具体的产品对象，
 * 这样做的目的是将产品类的实例化操作延迟到工厂子类中完成，即通过工厂子类来确定究竟应该实例化哪一个具体产品类。
 */
abstract class BMWFactory_two {
  abstract produceBMW(): BMW;
}

class BMW730Factory extends BMWFactory_two {
  produceBMW(): BMW {
    return new BMW730();
  }
}

class BMW840Factory extends BMWFactory_two {
  produceBMW(): BMW {
    return new BMW840();
  }
}
/**
 * 在以上代码中，我们分别创建了 BMW730Factory 和 BMW840Factory 两个工厂类，然后使用这两个类的实例来生产不同型号的车子。
 */
const bmw730Factory = new BMW730Factory();
const bmw840Factory = new BMW840Factory();

const bmw730_two = bmw730Factory.produceBMW();
const bmw840_two = bmw840Factory.produceBMW();

bmw730_two.run();
bmw840_two.run();


/**
 * - 抽象工厂
 * 
 * 
 */
abstract class BMWFactory_three {
  abstract produce730BMW(): BMW730;
  abstract produce840BMW(): BMW840;
}

class ConcreteBMWFactory extends BMWFactory_three {
  produce730BMW(): BMW730 {
    return new BMW730();
  }

  produce840BMW(): BMW840 {
    return new BMW840();
  }
}

const bmwFactory = new ConcreteBMWFactory();

const bmw730_three = bmwFactory.produce730BMW();
const bmw840_three = bmwFactory.produce840BMW();

bmw730_three.run();
bmw840_three.run();


