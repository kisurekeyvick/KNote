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
 * 抽象工厂模式（Abstract Factory Pattern），提供一个创建一系列相关或相互依赖对象的接口，而无须指定它们具体的类。
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


/**
 * 单例模式
 * 
 * 单例模式（Singleton Pattern）是一种常用的模式，有一些对象我们往往只需要一个，比如全局缓存、浏览器中的 window 对象等。
 * 单例模式用于保证一个类仅有一个实例，并提供一个访问它的全局访问点。
 */
class Singleton {
  // 定义私有的静态属性，来保存对象实例
  private static singleton: Singleton;
  private constructor() {}

  // 提供一个静态的方法来获取对象实例
  public static getInstance(): Singleton {
    if (!Singleton.singleton) {
      Singleton.singleton = new Singleton();
    }

    return Singleton.singleton;
  }
}

// 使用示例
let instance1 = Singleton.getInstance();
let instance2 = Singleton.getInstance();
console.log(instance1 === instance2); 

/**
 * 应用场景
 * 
 * - 需要频繁实例化然后销毁的对象
 * - 创建对象时耗时过多或耗资源过多，但又经常用到的对象
 * - 系统只需要一个实例对象，如系统要求提供一个唯一的序列号生成器或资源管理器，或者需要考虑资源消耗太大而只允许创建一个对象。
 */


/**
 * 适配器模式
 * 
 * 因为 Logger 和 CloudLogger 这两个接口不匹配，所以我们引入了 CloudLoggerAdapter 适配器来解决兼容性问题。
 * 
 * 使用场景：
 * (1) 以前开发的系统存在满足新系统功能需求的类，但其接口同新系统的接口不一致
 * (2) 使用第三方提供的组件，但组件接口定义和自己要求的接口定义不同
 */
interface Logger {
  info(message: string): Promise<void>;
}

interface CloudLogger {
  sendToServer(message: string, type: string): Promise<void>;
}

class AliLogger implements CloudLogger {
  public async sendToServer(message: string, type: string): Promise<void> {
    console.info(message);
    console.info('This Message was saved with AliLogger');
  }
}

class CloudLoggerAdapter implements Logger {
  protected cloudLogger: CloudLogger;

  constructor (cloudLogger: CloudLogger) {
    this.cloudLogger = cloudLogger;
  }

  public async info(message: string): Promise<void> {
    await this.cloudLogger.sendToServer(message, 'info');
  }
}

class NotificationService {
  protected logger: Logger;
  
  constructor (logger: Logger) {    
    this.logger = logger;
  }

  public async send(message: string): Promise<void> {
    await this.logger.info(`Notification sended: ${message}`);
  }
}

// 使用示例
(async () => {
  const aliLogger = new AliLogger();
  const cloudLoggerAdapter = new CloudLoggerAdapter(aliLogger);
  const notificationService = new NotificationService(cloudLoggerAdapter);
  await notificationService.send('Hello semlinker, To Cloud');
})();


/**
 * 观察者模式 & 发布订阅模式
 * 
 * 观察者模式，它定义了一种一对多的关系，让多个观察者对象同时监听某一个主题对象，
 * 这个主题对象的状态发生变化时就会通知所有的观察者对象，使得它们能够自动更新自己。
 */
interface Observer {
  notify: Function;
}

class ConcreteObserver implements Observer{
  constructor(private name: string) {}

  notify() {
    console.log(`${this.name} has been notified.`);
  }
}

class Subject { 
  private observers: Observer[] = [];

  public addObserver(observer: Observer): void {
    console.log(observer, "is pushed!");
    this.observers.push(observer);
  }

  public deleteObserver(observer: Observer): void {
    console.log("remove", observer);
    const n: number = this.observers.indexOf(observer);
    n != -1 && this.observers.splice(n, 1);
  }

  public notifyObservers(): void {
    console.log("notify all the observers", this.observers);
    this.observers.forEach(observer => observer.notify());
  }
}

const subject: Subject = new Subject();
const xiaoQin = new ConcreteObserver("小秦");
const xiaoWang = new ConcreteObserver("小王");
subject.addObserver(xiaoQin);
subject.addObserver(xiaoWang);
subject.notifyObservers();

subject.deleteObserver(xiaoQin);
subject.notifyObservers();


/** 
 * 发布订阅模式
 * 
 * 在软件架构中，发布/订阅是一种消息范式，消息的发送者（称为发布者）不会将消息直接发送给特定的接收者（称为订阅者）。
 * 而是将发布的消息分为不同的类别，然后分别发送给不同的订阅者。 
 * 同样的，订阅者可以表达对一个或多个类别的兴趣，只接收感兴趣的消息，无需了解哪些发布者存在。
 * 
 * 发布订阅模式中有三个主要角色：Publisher（发布者）、 Channels（通道）和 Subscriber（订阅者）
 */
type EventHandler = (...args: any[]) => any;

class EventEmitter {
  private c = new Map<string, EventHandler[]>();

  // 订阅指定的主题
  subscribe(topic: string, ...handlers: EventHandler[]) {
    let topics = this.c.get(topic);
    if (!topics) {
      this.c.set(topic, topics = []);
    }
    topics.push(...handlers);
  }

  // 取消订阅指定的主题
  unsubscribe(topic: string, handler?: EventHandler): boolean {
    if (!handler) {
      return this.c.delete(topic);
    }

    const topics = this.c.get(topic);
    if (!topics) {
      return false;
    }
    
    const index = topics.indexOf(handler);

    if (index < 0) {
      return false;
    }
    topics.splice(index, 1);
    if (topics.length === 0) {
      this.c.delete(topic);
    }
    return true;
  }

  // 为指定的主题发布消息
  publish(topic: string, ...args: any[]): any[] | null {
    const topics = this.c.get(topic);
    if (!topics) {
      return null;
    }
    return topics.map(handler => {
      try {
        return handler(...args);
      } catch (e) {
        console.error(e);
        return null;
      }
    });
  }
}

const eventEmitter = new EventEmitter();
eventEmitter.subscribe("ts", (msg) => console.log(`收到订阅的消息：${msg}`) );

eventEmitter.publish("ts", "TypeScript发布订阅模式");
eventEmitter.unsubscribe("ts");
eventEmitter.publish("ts", "TypeScript发布订阅模式");



