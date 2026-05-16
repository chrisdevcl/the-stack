export const CATEGORIES = {
  FUNDAMENTOS:  { key: 'FUNDAMENTOS',  label: 'Fundamentos',             color: '#818CF8' },
  PATRONES:     { key: 'PATRONES',     label: 'Patrones y Arquitectura', color: '#34D399' },
  DEUDA:        { key: 'DEUDA',        label: 'Cambio y Deuda',          color: '#FBBF24' },
  TESTING:      { key: 'TESTING',      label: 'Testing',                 color: '#F472B6' },
  SISTEMAS:     { key: 'SISTEMAS',     label: 'Sistemas y Ops',          color: '#38BDF8' },
  COLABORACION: { key: 'COLABORACION', label: 'Colaboración',            color: '#C084FC' },
  SISTEMICO:    { key: 'SISTEMICO',    label: 'Pensamiento Sistémico',   color: '#FB923C' },
};

export const concepts = [
  {
    id: 'solid',
    category: 'FUNDAMENTOS',
    icon: '🏛️',
    title: 'SOLID',
    description: 'Cinco principios de diseño orientado a objetos que definen cómo deben relacionarse clases y módulos para que el código sea fácil de cambiar y de probar.',
    solves: 'Clases con demasiadas responsabilidades, código que rompe al cambiar, y dependencias imposibles de reemplazar en tests.',
    detail: 'SOLID es un acrónimo que agrupa cinco principios pensados para que el código sea fácil de cambiar sin romper lo que ya funciona.\n\n**S — Single Responsibility:** cada clase debería tener una sola razón para cambiar. Si tu clase hace varias cosas, un cambio en cualquiera puede romper las demás.\n\n**O — Open/Closed:** el código debe estar abierto para ser extendido pero cerrado para ser modificado. Agregar comportamiento nuevo no debería requerir editar código que ya funciona.\n\n**L — Liskov Substitution:** si reemplazas una clase por una subclase, el programa debería seguir funcionando igual. Las subclases no deben romper el contrato de la clase base.\n\n**I — Interface Segregation:** mejor tener varias interfaces pequeñas y específicas que una sola grande. Las clases no deberían implementar métodos que no necesitan.\n\n**D — Dependency Inversion:** los módulos de alto nivel no deben depender de los de bajo nivel; ambos deben depender de abstracciones. En la práctica: depende de interfaces, no de implementaciones concretas.',
    points: [
      'Una clase que hace muchas cosas es difícil de probar, reutilizar y explicar',
      'Depender de interfaces en vez de clases concretas facilita el reemplazo y el testeo',
      'Aplicar SOLID no significa agregar más código, sino distribuirlo mejor',
      'No todos los principios aplican siempre — úsalos cuando el contexto lo justifica',
    ],
    codeExamples: [
      {
        lang: 'typescript', label: 'TypeScript',
        bad:
`// Una clase con tres responsabilidades distintas (viola S)
class UserService {
  async register(data: { name: string; email: string }) {
    await db.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [data.name, data.email]
    )
    await mailer.send(data.email, 'Bienvenido!')
    await pdfService.generate('/reports/' + data.email + '.pdf', data)
  }
}`,
        good:
`// Cada clase tiene una sola razón para cambiar
class UserRepository {
  async save(data: { name: string; email: string }) {
    await db.query('INSERT INTO users VALUES (?, ?)', [data.name, data.email])
  }
}

class WelcomeMailer {
  async send(email: string) {
    await mailer.send(email, 'Bienvenido!')
  }
}

class UserRegistrationService {
  constructor(private repo: UserRepository, private mailer: WelcomeMailer) {}

  async register(data: { name: string; email: string }) {
    await this.repo.save(data)
    await this.mailer.send(data.email)
  }
}`,
      },
      {
        lang: 'python', label: 'Python',
        bad:
`# Una clase que mezcla persistencia, email y PDFs
class UserService:
    def register(self, name: str, email: str):
        db.execute("INSERT INTO users VALUES (?, ?)", name, email)
        mailer.send(email, "Bienvenido!")
        pdf_service.generate(f"/reports/{email}.pdf", {"name": name})`,
        good:
`# Cada clase tiene una sola responsabilidad
class UserRepository:
    def save(self, name: str, email: str):
        db.execute("INSERT INTO users VALUES (?, ?)", name, email)

class WelcomeMailer:
    def send(self, email: str):
        mailer.send(email, "Bienvenido!")

class UserRegistrationService:
    def __init__(self, repo: UserRepository, mailer: WelcomeMailer):
        self.repo = repo
        self.mailer = mailer

    def register(self, name: str, email: str):
        self.repo.save(name, email)
        self.mailer.send(email)`,
      },
      {
        lang: 'java', label: 'Java',
        bad:
`// Una clase que mezcla DB, email y generación de PDFs
public class UserService {
    public void register(String name, String email) {
        db.query("INSERT INTO users VALUES (?, ?)", name, email);
        mailer.send(email, "Bienvenido!");
        pdfService.generate("/reports/" + email + ".pdf", name);
    }
}`,
        good:
`public class UserRepository {
    public void save(String name, String email) {
        db.query("INSERT INTO users VALUES (?, ?)", name, email);
    }
}

public class WelcomeMailer {
    public void send(String email) {
        mailer.send(email, "Bienvenido!");
    }
}

public class UserRegistrationService {
    private final UserRepository repo;
    private final WelcomeMailer mailer;

    public UserRegistrationService(UserRepository repo, WelcomeMailer mailer) {
        this.repo = repo; this.mailer = mailer;
    }

    public void register(String name, String email) {
        repo.save(name, email);
        mailer.send(email);
    }
}`,
      },
    ],
  },

  {
    id: 'dry-yagni-kiss',
    category: 'FUNDAMENTOS',
    icon: '✂️',
    title: 'DRY / YAGNI / KISS',
    description: 'Tres principios que guían cuánto y cómo escribir código: no repetir, no anticipar y no complicar.',
    solves: 'Duplicación que genera inconsistencias, sobreingeniería prematura y abstracciones que hacen el código más difícil de entender.',
    detail: 'Estos tres principios se complementan y, juntos, evitan dos errores opuestos: escribir demasiado y escribir lo mismo dos veces.\n\n**DRY — Don\'t Repeat Yourself:** cada pieza de conocimiento debe tener una sola representación en el sistema. Si cambias la lógica en un lugar y tienes que buscar otros tres donde también está duplicada, eso es una violación de DRY.\n\n**YAGNI — You Aren\'t Gonna Need It:** no construyas algo porque "en el futuro lo vamos a necesitar". El código que nadie usa sigue costando: hay que entenderlo, mantenerlo y adaptarlo.\n\n**KISS — Keep It Simple:** ante dos soluciones que resuelven el mismo problema, la más simple es casi siempre la correcta.',
    points: [
      'DRY no es sobre líneas de código duplicadas, sino sobre fuentes de verdad duplicadas',
      'YAGNI no es excusa para no diseñar bien — es para no construir features imaginarias',
      'El código simple es más fácil de cambiar que el código "flexible"',
      'Abstraer demasiado pronto puede ser tan dañino como no abstraer nada',
    ],
    codeExamples: [
      {
        lang: 'typescript', label: 'TypeScript',
        bad:
`// La misma lógica de descuento duplicada en tres lugares (viola DRY)
function checkoutRegular(price: number) {
  const discount = price > 100 ? price * 0.1 : 0
  return price - discount
}

function checkoutVip(price: number) {
  const discount = price > 100 ? price * 0.1 : 0  // copiado
  return (price - discount) * 0.95
}

function applyPromoCode(price: number) {
  const discount = price > 100 ? price * 0.1 : 0  // copiado de nuevo
  return price - discount - 5
}`,
        good:
`// Una sola fuente de verdad para la lógica de descuento
function calculateVolumeDiscount(price: number): number {
  return price > 100 ? price * 0.1 : 0
}

function checkoutRegular(price: number) {
  return price - calculateVolumeDiscount(price)
}

function checkoutVip(price: number) {
  return (price - calculateVolumeDiscount(price)) * 0.95
}

function applyPromoCode(price: number) {
  return price - calculateVolumeDiscount(price) - 5
}`,
      },
      {
        lang: 'python', label: 'Python',
        bad:
`# Lógica de validación duplicada en cada endpoint (viola DRY)
def create_user(data):
    if not data.get("email") or "@" not in data["email"]:
        raise ValueError("Email inválido")
    if len(data.get("password", "")) < 8:
        raise ValueError("Password muy corto")
    db.save(data)

def update_user(data):
    if not data.get("email") or "@" not in data["email"]:
        raise ValueError("Email inválido")
    if len(data.get("password", "")) < 8:
        raise ValueError("Password muy corto")
    db.update(data)`,
        good:
`# Validación centralizada: cambia en un solo lugar
def validate_user_data(data: dict):
    if not data.get("email") or "@" not in data["email"]:
        raise ValueError("Email inválido")
    if len(data.get("password", "")) < 8:
        raise ValueError("Password muy corto")

def create_user(data):
    validate_user_data(data)
    db.save(data)

def update_user(data):
    validate_user_data(data)
    db.update(data)`,
      },
      {
        lang: 'java', label: 'Java',
        bad:
`// YAGNI: sistema de plugins que nadie pidió, para un CRUD simple
public class UserService {
    private final PluginRegistry pluginRegistry;
    private final EventBus eventBus;
    private final MiddlewareChain middlewareChain;
    private final UserRepository repo;

    public void register(User user) {
        middlewareChain.execute(user);
        pluginRegistry.beforeSave(user);
        repo.save(user);
        pluginRegistry.afterSave(user);
        eventBus.publish(new UserRegisteredEvent(user));
    }
}`,
        good:
`// KISS: lo que el negocio necesita hoy
public class UserService {
    private final UserRepository repo;
    private final WelcomeMailer mailer;

    public void register(User user) {
        repo.save(user);
        mailer.send(user.getEmail());
    }
}`,
      },
    ],
  },

  {
    id: 'clean-code',
    category: 'FUNDAMENTOS',
    icon: '✨',
    title: 'Clean Code',
    description: 'Prácticas para escribir código que cualquier persona del equipo pueda entender, modificar y probar sin necesidad de una explicación previa.',
    solves: 'Código que tarda horas en entenderse, revisiones de PR interminables y la sensación de que hay que reescribir todo antes de poder modificar algo.',
    detail: 'Clean Code es una filosofía popularizada por Robert Martin que parte de una premisa simple: el código se lee mucho más de lo que se escribe.\n\n**Nombres que hablan:** una variable llamada `d` no dice nada; `daysSinceLastDeployment` no necesita comentario.\n\n**Funciones pequeñas con una sola responsabilidad:** si tienes que escribir "y también" para describir lo que hace una función, probablemente hace demasiado.\n\n**Sin comentarios que expliquen código malo:** si sientes la necesidad de comentar qué hace un bloque, es señal de que el código podría comunicarlo mejor.',
    points: [
      'El código limpio no es el más corto ni el más inteligente, es el más claro',
      'Un buen nombre elimina la necesidad de un comentario',
      'Las funciones deberían poder leerse casi como oraciones en lenguaje natural',
      'El código que nadie puede cambiar con confianza no es un activo, es un pasivo',
    ],
    codeExamples: [
      {
        lang: 'typescript', label: 'TypeScript',
        bad:
`// ¿Qué hace esto? Hay que ejecutarlo para entenderlo
function fn(d: any[], f: number) {
  let r = []
  for (let i = 0; i < d.length; i++) {
    if (d[i].s === 1 && d[i].p < f) {
      r.push(d[i])
    }
  }
  return r
}`,
        good:
`// El código se lee como una descripción del problema
function getActiveProductsBelowPrice(
  products: Product[],
  maxPrice: number
): Product[] {
  return products.filter(
    product => product.isActive && product.price < maxPrice
  )
}`,
      },
      {
        lang: 'python', label: 'Python',
        bad:
`# Nombres crípticos + función que hace demasiado + comentario que explica código malo
def proc(u, t):
    # verifica si el usuario puede hacer cosas
    if u['a'] == True and u['lvl'] > 2 and not u['ban']:
        if t == 'r':
            do_r(u)
        elif t == 'w':
            do_w(u)
        elif t == 'd':
            do_d(u)`,
        good:
`def is_authorized(user: dict, action: str) -> bool:
    return user["is_active"] and user["level"] > 2 and not user["is_banned"]

def handle_action(user: dict, action: str):
    if not is_authorized(user, action):
        raise PermissionError("Usuario sin permisos")

    actions = {"read": read, "write": write, "delete": delete}
    handler = actions.get(action)
    if handler:
        handler(user)`,
      },
      {
        lang: 'java', label: 'Java',
        bad:
`// Función de 40 líneas que hace todo, con números mágicos
public double calc(List<Item> items, String c, boolean m) {
    double t = 0;
    for (Item i : items) t += i.p * i.q;
    if (c.equals("VIP10")) t *= 0.90;
    if (c.equals("PROMO20")) t *= 0.80;
    if (m) t += 4.99;
    if (t > 150) t -= 15;
    return t;
}`,
        good:
`private static final double SHIPPING_COST = 4.99;
private static final double FREE_SHIPPING_THRESHOLD = 150.0;
private static final double FREE_SHIPPING_DISCOUNT = 15.0;

public double calculateOrderTotal(List<Item> items, String couponCode, boolean needsShipping) {
    double subtotal = calculateSubtotal(items);
    double afterCoupon = applyCoupon(subtotal, couponCode);
    double afterShipping = addShippingIfNeeded(afterCoupon, needsShipping);
    return applyVolumeDiscount(afterShipping);
}`,
      },
    ],
  },

  {
    id: 'cohesion-acoplamiento',
    category: 'FUNDAMENTOS',
    icon: '🔗',
    title: 'Cohesión y Acoplamiento',
    description: 'Cohesión alta: cada módulo hace una sola cosa bien. Bajo acoplamiento: los módulos dependen entre sí lo mínimo posible.',
    solves: 'Cambios en cascada donde tocar un módulo rompe varios más, e imposibilidad de probar componentes en aislamiento.',
    detail: 'Cohesión y acoplamiento son las dos métricas más importantes para evaluar la calidad estructural de un diseño.\n\n**Cohesión alta:** los elementos dentro de un módulo trabajan hacia el mismo objetivo. Un módulo con baja cohesión es un cajón de sastre.\n\n**Bajo acoplamiento:** los módulos conocen poco de los internos de los demás. Se comunican a través de interfaces estables. Cambiar uno no debería obligar a cambiar los que dependen de él.',
    points: [
      'Si un módulo es difícil de nombrar, probablemente tiene baja cohesión',
      'El acoplamiento alto convierte cada cambio en una investigación arqueológica',
      'Depender de interfaces en vez de clases concretas reduce el acoplamiento',
      'Tests difíciles de escribir suelen ser una señal de acoplamiento alto',
    ],
    codeExamples: [
      {
        lang: 'typescript', label: 'TypeScript',
        bad:
`// OrderService acoplado directamente a implementaciones concretas
class OrderService {
  processOrder(order: Order) {
    // Acoplado a la implementación de inventario
    const db = new MySQLDatabase()
    const stock = db.query('SELECT stock FROM products WHERE id = ?', order.productId)
    if (stock < order.quantity) throw new Error('Sin stock')

    // Acoplado a SendGrid directamente
    const sg = new SendGridClient(process.env.SENDGRID_KEY)
    sg.send({ to: order.email, subject: 'Tu orden fue procesada' })
  }
}`,
        good:
`// OrderService depende de abstracciones, no de implementaciones
interface InventoryService { checkStock(productId: string, qty: number): boolean }
interface NotificationService { notifyOrderProcessed(email: string): void }

class OrderService {
  constructor(
    private inventory: InventoryService,
    private notifications: NotificationService
  ) {}

  processOrder(order: Order) {
    if (!this.inventory.checkStock(order.productId, order.quantity)) {
      throw new Error('Sin stock')
    }
    this.notifications.notifyOrderProcessed(order.email)
  }
}`,
      },
      {
        lang: 'python', label: 'Python',
        bad:
`# Módulo con baja cohesión: mezcla lógica de negocio, email y reportes
class OrderManager:
    def process(self, order):
        db.execute("UPDATE stock SET qty = qty - ? WHERE id = ?",
                   order.qty, order.product_id)
        smtp = smtplib.SMTP("smtp.gmail.com", 587)
        smtp.sendmail("from@app.com", order.email, "Orden procesada")
        pdf = reportlab.create_pdf()
        pdf.save(f"/reports/{order.id}.pdf")`,
        good:
`# Cada clase con alta cohesión, acoplamiento a través de interfaces
class InventoryService:
    def deduct_stock(self, product_id: str, qty: int): ...

class NotificationService:
    def send_order_confirmation(self, email: str, order_id: str): ...

class ReportService:
    def generate_order_report(self, order_id: str): ...

class OrderProcessor:
    def __init__(self, inventory, notifications, reports):
        self.inventory = inventory
        self.notifications = notifications
        self.reports = reports

    def process(self, order):
        self.inventory.deduct_stock(order.product_id, order.qty)
        self.notifications.send_order_confirmation(order.email, order.id)
        self.reports.generate_order_report(order.id)`,
      },
          {
        lang: 'java', label: 'Java',
        bad:
`// OrderService acoplado directamente a implementaciones concretas
public class OrderService {
    public void processOrder(Order order) {
        // Acoplado a MySQL directamente
        MySQLDatabase db = new MySQLDatabase("jdbc:mysql://prod/db");
        int stock = db.queryInt("SELECT stock FROM products WHERE id = ?", order.getProductId());
        if (stock < order.getQuantity()) throw new RuntimeException("Sin stock");

        // Acoplado a SendGrid directamente
        SendGridClient sg = new SendGridClient(System.getenv("SENDGRID_KEY"));
        sg.send(order.getEmail(), "Tu orden fue procesada");
    }
}`,
        good:
`// OrderService depende de abstracciones, no de implementaciones
public interface InventoryService {
    boolean hasStock(String productId, int quantity);
}

public interface NotificationService {
    void notifyOrderProcessed(String email);
}

public class OrderService {
    private final InventoryService inventory;
    private final NotificationService notifications;

    public OrderService(InventoryService inventory, NotificationService notifications) {
        this.inventory = inventory;
        this.notifications = notifications;
    }

    public void processOrder(Order order) {
        if (!inventory.hasStock(order.getProductId(), order.getQuantity())) {
            throw new OutOfStockException(order.getProductId());
        }
        notifications.notifyOrderProcessed(order.getEmail());
    }
}`,
      },
    ],
  },

  {
    id: 'design-patterns',
    category: 'PATRONES',
    icon: '🧩',
    title: 'Design Patterns',
    description: 'Soluciones reutilizables a problemas recurrentes de diseño. Son un vocabulario compartido para comunicar intenciones de diseño entre desarrolladores.',
    solves: 'Reinventar soluciones que ya existen y no tener un lenguaje común para hablar de diseño en equipo.',
    detail: 'Los patrones de diseño, popularizados por el libro del "Gang of Four" (GoF), no son código que copias y pegas — son plantillas para resolver tipos de problemas que aparecen una y otra vez.\n\n**Creacionales** (cómo se crean los objetos): Factory Method, Builder, Singleton.\n\n**Estructurales** (cómo se componen): Adapter, Decorator, Facade.\n\n**De comportamiento** (cómo se comunican): Observer, Strategy, Command.\n\nLo más valioso es el nombre: decir "usé un Observer" comunica una intención completa en una sola palabra.',
    points: [
      'Los patrones son vocabulario, no recetas — entiende el problema antes de aplicar el patrón',
      'No todos los patrones aplican a todos los lenguajes o paradigmas',
      'El patrón Strategy elimina condicionales complejos de forma elegante',
      'Observer es la base de la mayoría de los sistemas de eventos y reactividad',
    ],
    codeExamples: [
      {
        lang: 'typescript', label: 'TypeScript',
        bad:
`// Sin patrón: switch que crece con cada método de pago nuevo
function processPayment(method: string, amount: number) {
  if (method === 'credit_card') {
    stripe.charge(amount)
  } else if (method === 'paypal') {
    paypal.send(amount)
  } else if (method === 'crypto') {
    coinbase.transfer(amount)
  }
  // Cada nuevo método = editar esta función
}`,
        good:
`// Patrón Strategy: agregar un método de pago = nueva clase, sin tocar lo existente
interface PaymentStrategy {
  process(amount: number): void
}

class StripePayment implements PaymentStrategy {
  process(amount: number) { stripe.charge(amount) }
}

class PayPalPayment implements PaymentStrategy {
  process(amount: number) { paypal.send(amount) }
}

class PaymentProcessor {
  constructor(private strategy: PaymentStrategy) {}
  pay(amount: number) { this.strategy.process(amount) }
}

const processor = new PaymentProcessor(new StripePayment())
processor.pay(99.90)`,
      },
      {
        lang: 'python', label: 'Python',
        bad:
`# Sin patrón Observer: notificaciones acopladas al servicio de órdenes
class OrderService:
    def complete_order(self, order):
        order.status = "completed"
        db.save(order)
        # Acoplado directamente a cada sistema de notificación
        email_service.send(order.email, "Tu orden está lista")
        sms_service.send(order.phone, "Orden lista")
        analytics.track("order_completed", order.id)`,
        good:
`# Patrón Observer: OrderService no sabe quién escucha sus eventos
class OrderService:
    def __init__(self):
        self._observers = []

    def subscribe(self, observer):
        self._observers.append(observer)

    def complete_order(self, order):
        order.status = "completed"
        db.save(order)
        for observer in self._observers:
            observer.on_order_completed(order)

# Agregar o quitar notificadores sin tocar OrderService
service = OrderService()
service.subscribe(EmailNotifier())
service.subscribe(SmsNotifier())
service.subscribe(AnalyticsTracker())`,
      },
      {
        lang: 'java', label: 'Java',
        bad:
`// Sin patrón Builder: constructor con 8 parámetros, imposible de leer
public class ReportConfig {
    public ReportConfig(String title, String format, String dateFrom,
      String dateTo, boolean includeCharts, boolean includeSummary,
      String currency, int maxRows) { ... }
}

// En uso: ¿qué es true y false acá?
new ReportConfig("Ventas", "PDF", "2024-01", "2024-12", true, false, "CLP", 1000)`,
        good:
`// Patrón Builder: construcción legible paso a paso
ReportConfig config = new ReportConfig.Builder("Ventas")
    .format("PDF")
    .dateRange("2024-01", "2024-12")
    .withCharts()
    .currency("CLP")
    .maxRows(1000)
    .build();`,
      },
    ],
  },

  {
    id: 'arquitecturas',
    category: 'PATRONES',
    icon: '🏗️',
    title: 'Arquitecturas de Software',
    description: 'Estilos estructurales para organizar sistemas completos. Cada uno define cómo fluyen las dependencias y dónde vive la lógica de negocio.',
    solves: 'Lógica de negocio mezclada con infraestructura, acoplamiento directo con frameworks y bases de datos, e imposibilidad de probar el dominio sin levantar todo el sistema.',
    detail: 'La arquitectura define las restricciones fundamentales del sistema.\n\n**Layered:** Presentación → Negocio → Datos. Simple, pero tiende a crear acoplamiento si no se aplica con disciplina.\n\n**Hexagonal / Ports & Adapters:** el dominio está en el centro. Se comunica con el exterior a través de interfaces. Facilita enormemente el testing.\n\n**Clean Architecture:** similar a hexagonal, la regla de dependencia dice que el código apunta hacia adentro.\n\n**Event-Driven:** los componentes se comunican emitiendo eventos. Desacopla mucho, pero requiere cuidado con la consistencia.',
    points: [
      'La arquitectura más popular no es necesariamente la más adecuada para tu caso',
      'El objetivo es aislar el dominio de los detalles de implementación',
      'Cambiar la base de datos no debería requerir tocar la lógica de negocio',
      'La arquitectura correcta depende de qué va a cambiar más frecuentemente',
    ],
    codeExamples: [
      {
        lang: 'typescript', label: 'TypeScript',
        bad:
`// Sin capas: el controller hace todo (consulta DB, lógica, respuesta)
app.post('/orders', async (req, res) => {
  const { userId, productId, qty } = req.body
  const stock = await db.query('SELECT stock FROM products WHERE id = ?', productId)
  if (stock[0].stock < qty) return res.status(400).json({ error: 'Sin stock' })
  const price = await db.query('SELECT price FROM products WHERE id = ?', productId)
  const total = price[0].price * qty
  await db.query('INSERT INTO orders (user_id, total) VALUES (?, ?)', userId, total)
  await mailer.send(req.body.email, 'Orden creada')
  res.json({ success: true })
})`,
        good:
`// Arquitectura en capas: cada capa con su responsabilidad
// Capa de dominio (sin dependencias externas)
class Order {
  static create(userId: string, items: OrderItem[]): Order { ... }
  getTotal(): number { ... }
}

// Capa de repositorio (solo persistencia)
class OrderRepository {
  async save(order: Order): Promise<void> { await db.query(...) }
}

// Capa de servicio (orquesta, contiene reglas de negocio)
class OrderService {
  async placeOrder(userId: string, items: OrderItem[]) {
    await this.inventory.verifyStock(items)
    const order = Order.create(userId, items)
    await this.repo.save(order)
    await this.notifications.orderConfirmed(order)
    return order
  }
}

// Capa de presentación (solo HTTP)
app.post('/orders', async (req, res) => {
  const order = await orderService.placeOrder(req.body)
  res.json(order)
})`,
      },
      {
        lang: 'python', label: 'Python',
        bad:
`# Sin arquitectura: Flask view con SQL, lógica y email mezclados
@app.route('/users', methods=['POST'])
def create_user():
    data = request.json
    if db.execute("SELECT 1 FROM users WHERE email = ?", data['email']).fetchone():
        return jsonify({"error": "Email ya existe"}), 400
    hashed = bcrypt.hashpw(data['password'].encode(), bcrypt.gensalt())
    db.execute("INSERT INTO users (email, password) VALUES (?, ?)",
               data['email'], hashed)
    smtp.sendmail("from@app.com", data['email'], "Bienvenido")
    return jsonify({"ok": True})`,
        good:
`# Arquitectura hexagonal: dominio sin dependencias de infraestructura
# Dominio
class User:
    def __init__(self, email: str, hashed_password: str): ...

# Puerto de salida (interfaz que el dominio define)
class UserRepository(ABC):
    @abstractmethod
    def find_by_email(self, email: str) -> Optional[User]: ...
    @abstractmethod
    def save(self, user: User): ...

# Servicio de aplicación (orquesta)
class RegisterUserUseCase:
    def __init__(self, repo: UserRepository, mailer: Mailer):
        self.repo = repo
        self.mailer = mailer

    def execute(self, email: str, password: str) -> User:
        if self.repo.find_by_email(email):
            raise ValueError("Email ya existe")
        user = User(email, hash_password(password))
        self.repo.save(user)
        self.mailer.welcome(user)
        return user

# Adaptador HTTP (solo traduce HTTP ↔ caso de uso)
@app.route('/users', methods=['POST'])
def create_user():
    user = register_user.execute(**request.json)
    return jsonify({"id": user.id})`,
      },
          {
        lang: 'java', label: 'Java',
        bad:
`// Servlet que mezcla HTTP, lógica de negocio y acceso a DB
@WebServlet("/orders")
public class OrderServlet extends HttpServlet {
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String userId = req.getParameter("userId");
        String productId = req.getParameter("productId");

        Connection conn = DriverManager.getConnection("jdbc:mysql://prod/db", "user", "pass");
        ResultSet rs = conn.createStatement().executeQuery(
            "SELECT stock FROM products WHERE id = '" + productId + "'"
        );
        if (rs.getInt("stock") < 1) { resp.sendError(400, "Sin stock"); return; }

        conn.createStatement().execute("INSERT INTO orders (user_id, product_id) VALUES (...)");
        new JavaMailSender().send(req.getParameter("email"), "Orden creada");
        resp.getWriter().write("{"ok": true}");
    }
}`,
        good:
`// Arquitectura en capas: cada capa con su responsabilidad
// Capa de dominio
public class Order {
    public static Order create(String userId, List<OrderItem> items) { ... }
    public Money getTotal() { ... }
}

// Capa de repositorio
public class OrderRepository {
    public void save(Order order) { db.execute("INSERT INTO orders ..."); }
}

// Capa de servicio (lógica de negocio)
public class OrderService {
    public Order placeOrder(String userId, List<OrderItem> items) {
        inventoryService.verifyStock(items);
        Order order = Order.create(userId, items);
        orderRepository.save(order);
        notificationService.orderConfirmed(order);
        return order;
    }
}

// Capa de presentación (solo HTTP)
@PostMapping("/orders")
public ResponseEntity<Order> createOrder(@RequestBody OrderRequest req) {
    return ResponseEntity.ok(orderService.placeOrder(req.getUserId(), req.getItems()));
}`,
      },
    ],
  },

  {
    id: 'ddd',
    category: 'PATRONES',
    icon: '🗺️',
    title: 'Domain-Driven Design',
    description: 'Metodología que centra el diseño en el dominio de negocio. El código debe reflejar fielmente los conceptos del negocio usando el mismo lenguaje que usan los expertos.',
    solves: 'Modelos que no representan el negocio real, confusión terminológica entre devs y stakeholders, y sistemas donde todo depende de todo.',
    detail: 'DDD propone que el software debería modelar el negocio tan fielmente que los expertos del dominio puedan participar en las conversaciones de diseño.\n\n**Ubiquitous Language:** un vocabulario único entre desarrolladores y negocio.\n\n**Bounded Contexts:** el sistema se divide en contextos con su propio modelo.\n\n**Aggregates, Entities y Value Objects:** los Aggregates definen fronteras de consistencia. Las Entities tienen identidad en el tiempo. Los Value Objects son inmutables y se definen por sus datos.',
    points: [
      'Si no entiendes el dominio, no puedes diseñar bien el software',
      'Los Bounded Contexts evitan que un modelo crezca hasta volverse inmanejable',
      'Un Value Object inmutable es más seguro que un objeto mutable',
      'El Ubiquitous Language reduce malentendidos que generan bugs difíciles de encontrar',
    ],
    codeExamples: [
      {
        lang: 'typescript', label: 'TypeScript',
        bad:
`// Modelo anémico: solo datos, cero comportamiento de dominio
class Order {
  id: string
  status: string
  total: number
  items: any[]
  userId: string
}

// La lógica de negocio está dispersa en servicios
class OrderService {
  cancelOrder(order: Order) {
    if (order.status === 'shipped') throw new Error('...')
    order.status = 'cancelled'   // manipulando estado directamente
  }
  addItem(order: Order, item: any) {
    order.items.push(item)
    order.total += item.price * item.qty
  }
}`,
        good:
`// Modelo rico: la lógica de negocio vive en el dominio
class Order {
  private status: OrderStatus
  private items: OrderItem[] = []

  addItem(product: Product, qty: number): void {
    if (this.status !== OrderStatus.Draft) throw new DomainError('Solo puedes agregar items a órdenes en borrador')
    this.items.push(new OrderItem(product, qty))
  }

  cancel(): void {
    if (this.status === OrderStatus.Shipped) throw new DomainError('No se puede cancelar una orden ya enviada')
    this.status = OrderStatus.Cancelled
  }

  getTotal(): Money {
    return this.items.reduce((sum, item) => sum.add(item.subtotal()), Money.zero())
  }
}`,
      },
      {
        lang: 'python', label: 'Python',
        bad:
`# Modelo anémico: lógica de negocio en el servicio, no en el dominio
@dataclass
class Order:
    id: str
    status: str
    items: list
    total: float

class OrderService:
    def add_item(self, order, product_id, qty, price):
        order.items.append({"product_id": product_id, "qty": qty})
        order.total += price * qty  # negocio en el servicio

    def cancel(self, order):
        if order.status == "shipped":  # regla de negocio fuera del dominio
            raise Exception("No se puede cancelar")
        order.status = "cancelled"`,
        good:
`# Modelo rico: las reglas de negocio viven en la entidad
class Order:
    def __init__(self, order_id: str):
        self._id = order_id
        self._status = OrderStatus.DRAFT
        self._items: list[OrderItem] = []

    def add_item(self, product: Product, qty: int) -> None:
        if self._status != OrderStatus.DRAFT:
            raise DomainError("Solo puedes agregar items a órdenes en borrador")
        self._items.append(OrderItem(product, qty))

    def cancel(self) -> None:
        if self._status == OrderStatus.SHIPPED:
            raise DomainError("No se puede cancelar una orden ya enviada")
        self._status = OrderStatus.CANCELLED

    def total(self) -> Money:
        return sum((item.subtotal() for item in self._items), Money.zero())`,
      },
          {
        lang: 'java', label: 'Java',
        bad:
`// Modelo anémico: solo getters/setters, cero lógica de dominio
public class Order {
    private String id;
    private String status;
    private List<OrderItem> items;
    private double total;

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }
}

// Reglas de negocio dispersas en servicios
public class OrderService {
    public void cancel(Order order) {
        if ("shipped".equals(order.getStatus())) throw new RuntimeException("...");
        order.setStatus("cancelled"); // mutación directa del estado
    }
}`,
        good:
`// Modelo rico: las reglas de negocio viven en la entidad
public class Order {
    private final String id;
    private OrderStatus status;
    private final List<OrderItem> items = new ArrayList<>();

    public void addItem(Product product, int quantity) {
        if (status != OrderStatus.DRAFT) {
            throw new DomainException("Solo puedes agregar items a órdenes en borrador");
        }
        items.add(new OrderItem(product, quantity));
    }

    public void cancel() {
        if (status == OrderStatus.SHIPPED) {
            throw new DomainException("No se puede cancelar una orden ya enviada");
        }
        this.status = OrderStatus.CANCELLED;
    }

    public Money getTotal() {
        return items.stream()
            .map(OrderItem::subtotal)
            .reduce(Money.ZERO, Money::add);
    }
}`,
      },
    ],
  },

  {
    id: 'refactoring',
    category: 'DEUDA',
    icon: '🔨',
    title: 'Refactoring',
    description: 'Mejorar la estructura interna del código sin cambiar su comportamiento externo. Se hace en pequeños pasos seguros, respaldados por tests.',
    solves: 'Deuda técnica acumulada, código que nadie quiere tocar y la tendencia de reescribir todo en vez de mejorar incrementalmente.',
    detail: 'Refactoring no es reescribir. Es una secuencia de transformaciones pequeñas y reversibles. Martin Fowler catalogó decenas de técnicas en su libro con el mismo nombre.\n\n**Técnicas comunes:** Extract Method, Rename Variable (el más barato y de mayor impacto), Replace Conditional with Polymorphism, Introduce Parameter Object.\n\n**El rol de los tests:** refactorizar sin tests es como hacer malabares sin red. Los tests confirman que el comportamiento no cambió.',
    points: [
      'Pequeños pasos seguros son mejores que grandes refactors que duran semanas',
      'Sin tests de respaldo, un refactor es una apuesta',
      'Renombrar bien es el refactor más simple y de mayor impacto inmediato',
      'El código muerto debe eliminarse, no comentarse',
    ],
    codeExamples: [
      {
        lang: 'typescript', label: 'TypeScript',
        bad:
`// Función larga que hace demasiado sin posibilidad de testear partes
function processOrder(order: any) {
  let total = 0
  for (const item of order.items) {
    total += item.price * item.quantity
  }
  if (order.coupon === 'SAVE10') total *= 0.9
  if (order.coupon === 'SAVE20') total *= 0.8
  if (total > 200) total -= 20
  if (!order.address || !order.address.city) throw new Error('Dirección inválida')
  if (order.items.length === 0) throw new Error('Sin items')
  db.save({ ...order, total })
  mailer.send(order.email, 'Tu orden por $' + total + ' fue procesada')
}`,
        good:
`// Extract Method: cada función tiene nombre y puede testearse sola
function calculateSubtotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

function applyCouponDiscount(subtotal: number, coupon: string): number {
  const discounts: Record<string, number> = { SAVE10: 0.9, SAVE20: 0.8 }
  return subtotal * (discounts[coupon] ?? 1)
}

function applyVolumeDiscount(total: number): number {
  return total > 200 ? total - 20 : total
}

function validateOrder(order: Order): void {
  if (!order.address?.city) throw new Error('Dirección inválida')
  if (order.items.length === 0) throw new Error('Sin items')
}

function processOrder(order: Order) {
  validateOrder(order)
  const total = applyVolumeDiscount(
    applyCouponDiscount(calculateSubtotal(order.items), order.coupon)
  )
  db.save({ ...order, total })
  mailer.send(order.email, 'Tu orden por $' + total + ' fue procesada')
}`,
      },
      {
        lang: 'python', label: 'Python',
        bad:
`# Método largo, imposible de testear partes en aislamiento
def generate_invoice(order):
    subtotal = sum(i['price'] * i['qty'] for i in order['items'])
    if order.get('type') == 'enterprise':
        subtotal *= 0.85
    elif order.get('type') == 'startup':
        subtotal *= 0.92
    tax = subtotal * 0.19
    total = subtotal + tax
    if total > 1000:
        total -= 50
    lines = [f"- {i['name']}: \${i['price'] * i['qty']:.2f}" for i in order['items']]
    body = "FACTURA\\n" + "\\n".join(lines) + f"\\nTotal: \${total:.2f}"
    pdf_service.create(body, f"/invoices/{order['id']}.pdf")`,
        good:
`# Extract Method aplicado: cada función tiene una responsabilidad
def calculate_subtotal(items: list) -> float:
    return sum(i['price'] * i['qty'] for i in items)

def apply_client_discount(subtotal: float, client_type: str) -> float:
    discounts = {"enterprise": 0.85, "startup": 0.92}
    return subtotal * discounts.get(client_type, 1.0)

def calculate_tax(amount: float, rate: float = 0.19) -> float:
    return amount * rate

def apply_volume_discount(total: float) -> float:
    return total - 50 if total > 1000 else total

def format_invoice_lines(items: list) -> str:
    lines = [f"- {i['name']}: \${i['price'] * i['qty']:.2f}" for i in items]
    return "\\n".join(lines)

def generate_invoice(order: dict):
    subtotal = calculate_subtotal(order['items'])
    after_discount = apply_client_discount(subtotal, order.get('type'))
    total = apply_volume_discount(after_discount + calculate_tax(after_discount))
    body = "FACTURA\\n" + format_invoice_lines(order['items']) + f"\\nTotal: \${total:.2f}"
    pdf_service.create(body, f"/invoices/{order['id']}.pdf")`,
      },
          {
        lang: 'java', label: 'Java',
        bad:
`// Método largo que hace todo: imposible de testear partes en aislamiento
public double processOrder(Order order) {
    double total = 0;
    for (OrderItem item : order.getItems()) {
        total += item.getPrice() * item.getQuantity();
    }
    if ("SAVE10".equals(order.getCoupon())) total *= 0.9;
    else if ("SAVE20".equals(order.getCoupon())) total *= 0.8;
    if (total > 200) total -= 20;
    if (order.getAddress() == null || order.getAddress().getCity() == null)
        throw new IllegalArgumentException("Dirección inválida");
    if (order.getItems().isEmpty())
        throw new IllegalArgumentException("Sin items");
    db.save(order.withTotal(total));
    mailer.send(order.getEmail(), "Orden por $" + total + " procesada");
    return total;
}`,
        good:
`// Extract Method: cada función tiene nombre y puede testearse por separado
private double calculateSubtotal(List<OrderItem> items) {
    return items.stream().mapToDouble(i -> i.getPrice() * i.getQuantity()).sum();
}

private double applyCoupon(double subtotal, String coupon) {
    Map<String, Double> discounts = Map.of("SAVE10", 0.9, "SAVE20", 0.8);
    return subtotal * discounts.getOrDefault(coupon, 1.0);
}

private double applyVolumeDiscount(double total) {
    return total > 200 ? total - 20 : total;
}

private void validateOrder(Order order) {
    if (order.getAddress() == null || order.getAddress().getCity() == null)
        throw new IllegalArgumentException("Dirección inválida");
    if (order.getItems().isEmpty())
        throw new IllegalArgumentException("Sin items");
}

public double processOrder(Order order) {
    validateOrder(order);
    double total = applyVolumeDiscount(
        applyCoupon(calculateSubtotal(order.getItems()), order.getCoupon())
    );
    db.save(order.withTotal(total));
    mailer.send(order.getEmail(), "Orden por $" + total + " procesada");
    return total;
}`,
      },
    ],
  },

  {
    id: 'deuda-tecnica',
    category: 'DEUDA',
    icon: '💳',
    title: 'Deuda Técnica',
    description: 'El costo futuro de tomar atajos hoy. Como una deuda financiera, tiene interés: mientras más se acumula, más cuesta cada cambio posterior.',
    solves: 'Incapacidad de cuantificar trabajo técnico frente a features, y equipos que sienten que todo se mueve cada vez más lento sin saber por qué.',
    detail: 'La metáfora la introdujo Ward Cunningham. La deuda no es necesariamente mala: a veces tiene sentido tomarla intencionalmente para entregar algo rápido.\n\n**Los cuatro cuadrantes de Fowler:** deliberada + prudente, deliberada + imprudente, inadvertida + prudente, inadvertida + imprudente.\n\n**Cómo gestionarla:** hacerla visible (backlog técnico), priorizarla junto con features, y pagar la que más impacta la velocidad.',
    points: [
      'Deuda deliberada y consciente es válida; deuda inadvertida es un problema',
      'El interés se paga en cada cambio futuro que tarda más de lo que debería',
      'Hacer visible la deuda técnica es el primer paso para gestionarla',
      'Los equipos lentos suelen serlo por deuda acumulada, no por falta de esfuerzo',
    ],
    codeExamples: [
      {
        lang: 'typescript', label: 'TypeScript',
        bad:
`// Números mágicos, lógica duplicada y tipos any: deuda que crece con cada cambio
function calculateShipping(weight: any, country: any): number {
  if (country === 'CL') {
    if (weight < 1) return 2990
    if (weight < 5) return 4990
    return 8990
  }
  if (country === 'AR' || country === 'PE') {
    return weight * 3.5 * 1000  // ¿qué es 3.5? ¿y 1000?
  }
  return weight * 5 * 1000
}`,
        good:
`// Constantes nombradas, lógica expresiva: fácil de cambiar sin miedo
const SHIPPING_RATES_CL = [
  { maxWeight: 1, price: 2990 },
  { maxWeight: 5, price: 4990 },
  { maxWeight: Infinity, price: 8990 },
]

const INTERNATIONAL_RATE_PER_KG = 3.5   // USD por kg
const CURRENCY_MULTIPLIER = 1000         // USD a CLP (aproximado)
const DEFAULT_RATE_PER_KG = 5

function calculateShipping(weightKg: number, countryCode: string): number {
  if (countryCode === 'CL') {
    const rate = SHIPPING_RATES_CL.find(r => weightKg < r.maxWeight)
    return rate?.price ?? SHIPPING_RATES_CL.at(-1)!.price
  }
  const ratePerKg = ['AR', 'PE'].includes(countryCode)
    ? INTERNATIONAL_RATE_PER_KG
    : DEFAULT_RATE_PER_KG
  return weightKg * ratePerKg * CURRENCY_MULTIPLIER
}`,
      },
      {
        lang: 'python', label: 'Python',
        bad:
`# Deuda acumulada: hardcoding, copy-paste, sin tipos
def get_plan_price(plan, months):
    if plan == "basic":
        p = 9.99
        if months >= 12: p = p * 0.8
        if months >= 6: p = p * 0.9
    elif plan == "pro":
        p = 29.99
        if months >= 12: p = p * 0.8  # copiado
        if months >= 6: p = p * 0.9   # copiado
    elif plan == "enterprise":
        p = 99.99
        if months >= 12: p = p * 0.8  # copiado por tercera vez
        if months >= 6: p = p * 0.9
    return p`,
        good:
`# Una sola fuente de verdad para precios y descuentos
from dataclasses import dataclass

ANNUAL_DISCOUNT = 0.80    # 20% off
SEMIANNUAL_DISCOUNT = 0.90  # 10% off

@dataclass
class PlanConfig:
    monthly_price: float

PLANS: dict[str, PlanConfig] = {
    "basic":      PlanConfig(monthly_price=9.99),
    "pro":        PlanConfig(monthly_price=29.99),
    "enterprise": PlanConfig(monthly_price=99.99),
}

def get_discount_multiplier(months: int) -> float:
    if months >= 12: return ANNUAL_DISCOUNT
    if months >= 6:  return SEMIANNUAL_DISCOUNT
    return 1.0

def get_plan_price(plan: str, months: int) -> float:
    config = PLANS[plan]
    return config.monthly_price * get_discount_multiplier(months)`,
      },
          {
        lang: 'java', label: 'Java',
        bad:
`// Números mágicos y lógica duplicada: deuda que crece con cada cambio
public double calculateShipping(double weight, String country) {
    if ("CL".equals(country)) {
        if (weight < 1) return 2990;
        if (weight < 5) return 4990;
        return 8990;
    }
    if ("AR".equals(country) || "PE".equals(country)) {
        return weight * 3.5 * 1000;  // ¿qué es 3.5? ¿y 1000?
    }
    return weight * 5 * 1000;
}`,
        good:
`// Constantes nombradas y lógica expresiva
public class ShippingCalculator {
    private static final double INTL_RATE_USD_PER_KG = 3.5;
    private static final double DEFAULT_RATE_USD_PER_KG = 5.0;
    private static final double USD_TO_CLP = 1000.0;
    private static final Set<String> LATAM_COUNTRIES = Set.of("AR", "PE", "UY", "CO");

    private static final List<ShippingTier> CL_TIERS = List.of(
        new ShippingTier(1.0, 2990),
        new ShippingTier(5.0, 4990),
        new ShippingTier(Double.MAX_VALUE, 8990)
    );

    public double calculateShipping(double weightKg, String countryCode) {
        if ("CL".equals(countryCode)) {
            return CL_TIERS.stream()
                .filter(t -> weightKg < t.maxWeight())
                .mapToDouble(ShippingTier::price)
                .findFirst().orElse(8990);
        }
        double ratePerKg = LATAM_COUNTRIES.contains(countryCode)
            ? INTL_RATE_USD_PER_KG : DEFAULT_RATE_USD_PER_KG;
        return weightKg * ratePerKg * USD_TO_CLP;
    }
}`,
      },
    ],
  },

  {
    id: 'feature-flags',
    category: 'DEUDA',
    icon: '🚩',
    title: 'Feature Flags',
    description: 'Activar o desactivar funcionalidades en producción sin deploy. Separa la entrega de código del lanzamiento de features.',
    solves: 'Branches de larga vida que generan conflictos, incapacidad de desplegar con frecuencia y el miedo a meter código incompleto en main.',
    detail: 'Un feature flag es básicamente un if. Esa simplicidad esconde un superpoder: desacoplar "subir código" de "mostrar la feature a usuarios".\n\n**Casos de uso:** trunk-based development, canary releases, A/B testing, kill switches.\n\n**El riesgo:** los flags que nunca se limpian acumulan condicionales difíciles de entender. Cada flag debería tener una fecha de expiración.',
    points: [
      'Separa deploy (subir el código) de release (mostrar la feature)',
      'Permite revertir una feature sin rollback del servidor',
      'Los flags viejos son deuda técnica — ponles fecha de muerte desde el inicio',
      'Necesario para trunk-based development en equipos de más de dos personas',
    ],
    codeExamples: [
      {
        lang: 'typescript', label: 'TypeScript',
        bad:
`// Sin flag: la feature nueva llega a todos apenas se hace deploy
async function getCheckoutTotal(cart: Cart): Promise<number> {
  // Nueva lógica de descuentos por región (en desarrollo, sin tests suficientes)
  const regionalDiscount = await regionService.getDiscount(cart.userRegion)
  const subtotal = cart.items.reduce((s, i) => s + i.price, 0)
  return subtotal * (1 - regionalDiscount)
}`,
        good:
`// Con flag: la feature nueva solo llega a quienes la tenemos habilitada
async function getCheckoutTotal(cart: Cart): Promise<number> {
  const subtotal = cart.items.reduce((s, i) => s + i.price, 0)

  // Flag expira: 2025-03-01 — owner: @equipo-checkout
  if (await featureFlags.isEnabled('regional-discounts', cart.userId)) {
    const regionalDiscount = await regionService.getDiscount(cart.userRegion)
    return subtotal * (1 - regionalDiscount)
  }

  return subtotal
}`,
      },
      {
        lang: 'python', label: 'Python',
        bad:
`# Sin flag: experimento A/B hardcodeado que llega a todos
def calculate_recommendation_score(user, product):
    # Nuevo algoritmo ML (aún sin validar en producción)
    embedding = ml_model.embed(product.description)
    user_vector = user_profile.get_vector(user.id)
    return cosine_similarity(embedding, user_vector)`,
        good:
`# Con flag: el nuevo algoritmo solo activa para el grupo de prueba
def calculate_recommendation_score(user: User, product: Product) -> float:
    # Flag expira: 2025-04-01 — experimento: ml-recommendations-v2
    if feature_flags.is_enabled("ml-recommendations-v2", user_id=user.id):
        embedding = ml_model.embed(product.description)
        user_vector = user_profile.get_vector(user.id)
        return cosine_similarity(embedding, user_vector)

    # Algoritmo estable actual
    return simple_score(user, product)`,
      },
          {
        lang: 'java', label: 'Java',
        bad:
`// Sin flag: la feature nueva llega a todos apenas se hace deploy
public class CheckoutService {
    public double getTotal(Cart cart) {
        // Nueva lógica de descuentos por región (sin suficientes tests)
        RegionalDiscount discount = regionService.getDiscount(cart.getUserRegion());
        double subtotal = cart.getItems().stream()
            .mapToDouble(Item::getPrice).sum();
        return subtotal * (1 - discount.getRate());
    }
}`,
        good:
`// Con flag: la feature solo activa para usuarios habilitados
public class CheckoutService {
    private final FeatureFlagService featureFlags;
    private final RegionService regionService;

    // Flag expira: 2025-03-01 — owner: equipo-checkout
    private static final String REGIONAL_DISCOUNTS_FLAG = "regional-discounts";

    public double getTotal(Cart cart) {
        double subtotal = cart.getItems().stream()
            .mapToDouble(Item::getPrice).sum();

        if (featureFlags.isEnabled(REGIONAL_DISCOUNTS_FLAG, cart.getUserId())) {
            RegionalDiscount discount = regionService.getDiscount(cart.getUserRegion());
            return subtotal * (1 - discount.getRate());
        }

        return subtotal;
    }
}`,
      },
    ],
  },

  {
    id: 'piramide-testing',
    category: 'TESTING',
    icon: '🔺',
    title: 'Pirámide de Testing',
    description: 'Muchos unit tests (rápidos y baratos), menos de integración, y pocos end-to-end (lentos y costosos de mantener).',
    solves: 'Suites de CI que tardan 45 minutos, tests frágiles que fallan por cualquier cambio de UI y falsa sensación de cobertura.',
    detail: 'La pirámide describe la distribución ideal de tests.\n\n**Unit tests:** prueban una función en aislamiento, sin red ni base de datos. Son rápidos (milisegundos) y deberían ser la mayoría.\n\n**Integration tests:** prueban cómo interactúan varios componentes. Más lentos y realistas.\n\n**End-to-end:** simulan al usuario real. Son los más realistas pero los más frágiles y caros. Deben ser pocos.\n\n**El antipatrón del cono de helado:** cuando hay muchos e2e y pocos unit, la suite es lenta y frágil.',
    points: [
      'Un unit test que tarda segundos es señal de dependencias ocultas',
      'Los e2e son valiosos pero no escalan — no los uses para cubrir lógica de negocio',
      'El objetivo no es 100% de cobertura, sino confianza para cambiar el código',
      'Si los tests son difíciles de escribir, el diseño del código tiene problemas',
    ],
    codeExamples: [
      {
        lang: 'typescript', label: 'TypeScript',
        bad:
`// Solo un test e2e para validar lógica de negocio: lento y frágil
// Cypress / Playwright — tarda 8s, falla si cambia el CSS
it('should apply discount correctly', () => {
  cy.visit('/checkout')
  cy.get('[data-test="product"]').first().click()
  cy.get('[data-test="coupon-input"]').type('SAVE20')
  cy.get('[data-test="apply-coupon"]').click()
  cy.get('[data-test="total"]').should('contain', '79.92')
})`,
        good:
`// Unit test para la lógica de negocio: corre en < 1ms
// La lógica es correcta independiente de la UI
describe('applyDiscount', () => {
  it('applies 20% discount with SAVE20 coupon', () => {
    expect(applyDiscount(99.90, 'SAVE20')).toBe(79.92)
  })
  it('applies 10% discount with SAVE10 coupon', () => {
    expect(applyDiscount(100, 'SAVE10')).toBe(90)
  })
  it('returns original price for unknown coupons', () => {
    expect(applyDiscount(100, 'INVALID')).toBe(100)
  })
  it('does not go below zero', () => {
    expect(applyDiscount(5, 'SAVE20')).toBeGreaterThanOrEqual(0)
  })
})`,
      },
      {
        lang: 'python', label: 'Python',
        bad:
`# Solo tests de integración pesados: necesitan levantar DB real
def test_order_total():
    # Levanta la base de datos, crea fixture, hace query real
    db.execute("INSERT INTO products VALUES (1, 'Laptop', 999.99)")
    db.execute("INSERT INTO products VALUES (2, 'Mouse', 29.99)")
    order = OrderService(db_connection=real_db).create_order(
        user_id=1, items=[{"product_id": 1, "qty": 1}, {"product_id": 2, "qty": 2}]
    )
    assert order.total == 1059.97`,
        good:
`# Unit test: sin DB, sin red, sin estado externo — corre en microsegundos
def test_order_total_calculation():
    items = [
        OrderItem(price=999.99, quantity=1),
        OrderItem(price=29.99, quantity=2),
    ]
    order = Order(items=items)
    assert order.calculate_total() == pytest.approx(1059.97)

def test_volume_discount_applied_above_threshold():
    items = [OrderItem(price=200.00, quantity=1)]
    order = Order(items=items)
    assert order.calculate_total() == 180.00  # 10% de descuento sobre $200

def test_empty_order_total_is_zero():
    assert Order(items=[]).calculate_total() == 0`,
      },
          {
        lang: 'java', label: 'Java',
        bad:
`// Solo test de integración pesado para validar lógica de negocio
@SpringBootTest
@AutoConfigureMockMvc
class OrderTotalTest {
    @Autowired MockMvc mvc;

    @Test
    void shouldApplyDiscount() throws Exception {
        // Levanta todo el contexto de Spring, necesita DB real
        mvc.perform(post("/orders")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"items\":[{\"price\":99.90,\"qty\":1}],\"coupon\":\"SAVE20\"}"))
           .andExpect(jsonPath("$.total").value(79.92));
        // Tarda ~5 segundos, falla si la DB no está disponible
    }
}`,
        good:
`// Unit test puro: sin Spring, sin DB, corre en milisegundos
class OrderTotalCalculatorTest {
    private final OrderTotalCalculator calculator = new OrderTotalCalculator();

    @Test
    void appliesTwentyPercentDiscountWithSave20Coupon() {
        double total = calculator.calculate(List.of(new OrderItem(99.90, 1)), "SAVE20");
        assertEquals(79.92, total, 0.001);
    }

    @Test
    void appliesTenPercentDiscountWithSave10Coupon() {
        double total = calculator.calculate(List.of(new OrderItem(100.0, 1)), "SAVE10");
        assertEquals(90.0, total, 0.001);
    }

    @Test
    void returnsOriginalPriceForUnknownCoupon() {
        double total = calculator.calculate(List.of(new OrderItem(100.0, 1)), "INVALID");
        assertEquals(100.0, total, 0.001);
    }
}`,
      },
    ],
  },

  {
    id: 'tdd',
    category: 'TESTING',
    icon: '🔄',
    title: 'TDD',
    description: 'Escribir el test antes que el código. El ciclo Red-Green-Refactor guía el diseño de forma emergente y garantiza que cada línea tiene razón de existir.',
    solves: 'APIs mal diseñadas que solo se descubren al usarlas, código difícil de probar por dependencias implícitas y la tendencia a agregar lógica sin verificación.',
    detail: 'TDD invierte el orden habitual: primero el test que falla, luego el mínimo código para que pase, finalmente refactorizar.\n\n**El ciclo Red-Green-Refactor:** Rojo (el test falla — esperado), Verde (mínimo código para que pase), Refactor (limpia sin romper el test).\n\n**El beneficio no obvio:** escribir el test primero te obliga a pensar en la interfaz pública antes de implementarla, lo que genera APIs más limpias.',
    points: [
      'El test primero te obliga a diseñar la API antes de implementarla',
      'Si es difícil escribir el test, el código probablemente tiene demasiadas dependencias',
      'TDD no garantiza que construyes lo correcto, solo que construiste lo que especificaste',
      'El ciclo rojo-verde-refactor debe ser rápido — minutos, no horas',
    ],
    codeExamples: [
      {
        lang: 'typescript', label: 'TypeScript',
        bad:
`// Sin TDD: primero implementamos, luego descubrimos que la API es incómoda
class PasswordValidator {
  private minLength: number
  private requireNumbers: boolean
  private requireSymbols: boolean
  constructor(minLength: number, requireNumbers: boolean, requireSymbols: boolean) {
    this.minLength = minLength
    this.requireNumbers = requireNumbers
    this.requireSymbols = requireSymbols
  }
  // Al escribir los tests después, notamos que el constructor es rígido
  // y es difícil probar casos específicos sin instanciar todo
  isValid(password: string): boolean { ... }
}`,
        good:
`// Con TDD: el test define la API que queremos antes de implementarla

// 1. RED: escribimos el test primero (falla porque no existe la clase)
describe('PasswordValidator', () => {
  it('rejects passwords shorter than 8 characters', () => {
    expect(isValidPassword('abc123')).toBe(false)
  })
  it('rejects passwords without numbers', () => {
    expect(isValidPassword('abcdefgh')).toBe(false)
  })
  it('accepts strong passwords', () => {
    expect(isValidPassword('Secure123!')).toBe(true)
  })
})

// 2. GREEN: implementamos el mínimo para que pase
function isValidPassword(password: string): boolean {
  return password.length >= 8 && /\d/.test(password) && /[^a-zA-Z0-9]/.test(password)
}

// 3. REFACTOR: limpiamos sin romper los tests
const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8, message: 'Mínimo 8 caracteres' },
  { test: (p: string) => /\d/.test(p),  message: 'Debe incluir un número' },
  { test: (p: string) => /\W/.test(p),  message: 'Debe incluir un símbolo' },
]`,
      },
      {
        lang: 'python', label: 'Python',
        bad:
`# Sin TDD: implementamos primero, los tests llegan tarde (o nunca)
def calculate_shipping_cost(weight_kg, destination, is_express):
    # Implementamos toda la lógica de una vez
    base = weight_kg * 1200
    if destination == "remote": base *= 1.5
    if is_express: base *= 2
    if weight_kg > 30: base += 5000
    return base
# Los tests descubren luego que hay casos edge no contemplados`,
        good:
`# Con TDD: los tests guían el diseño uno a uno

# 1. RED: empezamos con el caso más simple
def test_base_shipping_cost():
    assert calculate_shipping_cost(weight_kg=1) == 1200

# (la función no existe aún — el test falla)

# 2. GREEN: mínimo código para pasar
def calculate_shipping_cost(weight_kg: float) -> int:
    return int(weight_kg * 1200)

# 3. Agregamos el siguiente caso
def test_remote_destination_surcharge():
    assert calculate_shipping_cost(1, destination="remote") == 1800

# 4. GREEN: extendemos la función
def calculate_shipping_cost(weight_kg: float, destination: str = "standard") -> int:
    base = weight_kg * 1200
    if destination == "remote": base *= 1.5
    return int(base)

# Continuamos así — cada test agrega un comportamiento concreto`,
      },
          {
        lang: 'java', label: 'Java',
        bad:
`// Sin TDD: implementamos primero, los tests descubren problemas tarde
public class PasswordValidator {
    private final int minLength;
    private final boolean requireNumbers;
    private final boolean requireSymbols;
    private final boolean requireUppercase;  // ¿alguien lo pidió?

    public PasswordValidator(int minLength, boolean requireNumbers,
                             boolean requireSymbols, boolean requireUppercase) {
        this.minLength = minLength;
        // Constructor difícil de usar en tests — demasiados parámetros
    }
    public boolean isValid(String password) { ... }
}`,
        good:
`// Con TDD: el test define la API que queremos antes de implementarla

// 1. RED: escribimos el test (falla porque la clase no existe aún)
class PasswordValidatorTest {
    @Test void rejectsPasswordsShorterThan8Chars() {
        assertFalse(PasswordValidator.isValid("abc123"));
    }
    @Test void rejectsPasswordsWithoutNumbers() {
        assertFalse(PasswordValidator.isValid("abcdefgh"));
    }
    @Test void acceptsStrongPasswords() {
        assertTrue(PasswordValidator.isValid("Secure123!"));
    }
}

// 2. GREEN: mínimo código para que pasen los tests
public class PasswordValidator {
    public static boolean isValid(String password) {
        return password.length() >= 8
            && password.chars().anyMatch(Character::isDigit)
            && password.chars().anyMatch(c -> !Character.isLetterOrDigit(c));
    }
}

// 3. REFACTOR: extraemos las reglas para que sean legibles y extensibles
private static final List<Predicate<String>> RULES = List.of(
    p -> p.length() >= 8,
    p -> p.chars().anyMatch(Character::isDigit),
    p -> p.chars().anyMatch(c -> !Character.isLetterOrDigit(c))
);`,
      },
    ],
  },

  {
    id: 'test-doubles',
    category: 'TESTING',
    icon: '🎭',
    title: 'Test Doubles',
    description: 'Sustitutos de dependencias reales: Stubs, Mocks, Fakes y Spies. Permiten probar en aislamiento sin base de datos, red ni servicios externos.',
    solves: 'Tests lentos que llaman a servicios reales, imposibilidad de simular errores de infraestructura y tests que fallan por razones ajenas al código bajo prueba.',
    detail: 'El término viene del cine — es el sustituto que reemplaza a la dependencia real durante el test.\n\n**Stub:** devuelve valores predefinidos. No verifica nada.\n\n**Mock:** verifica que fue llamado de cierta manera. Útil para interacciones (que se envíe un email exactamente una vez).\n\n**Fake:** implementación simplificada pero funcional (una DB en memoria).\n\n**Spy:** registra llamadas sin bloquear el comportamiento real.',
    points: [
      'Elegir el tipo incorrecto de double complica los tests innecesariamente',
      'Demasiados mocks suelen indicar que el diseño tiene problemas de acoplamiento',
      'Un Fake bien hecho puede hacer tests de integración casi tan rápidos como unitarios',
      'Los mocks acoplan el test a detalles de implementación — úsalos con criterio',
    ],
    codeExamples: [
      {
        lang: 'typescript', label: 'TypeScript',
        bad:
`// Test que llama a SendGrid real: lento, caro, no determinista
describe('UserRegistrationService', () => {
  it('sends welcome email on registration', async () => {
    const service = new UserRegistrationService(
      new PostgresUserRepository(),   // conecta a DB real
      new SendGridMailer()             // llama a API de SendGrid real
    )
    await service.register({ name: 'Ana', email: 'ana@test.com' })
    // ¿Cómo verificamos que el email se envió? No podemos sin acceder a SendGrid
  })
})`,
        good:
`// Mock: verifica que el mailer fue llamado con los parámetros correctos
// Stub: el repositorio retorna un valor fijo sin tocar la DB
describe('UserRegistrationService', () => {
  it('sends welcome email on registration', async () => {
    const repoStub = { save: jest.fn().mockResolvedValue(undefined) }
    const mailerMock = { send: jest.fn().mockResolvedValue(undefined) }

    const service = new UserRegistrationService(repoStub, mailerMock)
    await service.register({ name: 'Ana', email: 'ana@test.com' })

    expect(mailerMock.send).toHaveBeenCalledOnce()
    expect(mailerMock.send).toHaveBeenCalledWith('ana@test.com', expect.any(String))
  })
})`,
      },
      {
        lang: 'python', label: 'Python',
        bad:
`# Test acoplado a implementaciones reales: necesita DB, SMTP y filesystem
def test_generate_and_send_report():
    service = ReportService(
        db=PostgresDB(host="localhost", port=5432),  # DB real
        mailer=SMTPMailer(host="smtp.gmail.com"),     # email real
        storage=S3Storage(bucket="prod-reports")      # S3 real
    )
    service.generate_and_send("sales", recipient="team@company.com")
    # El test falla si no hay DB, si Gmail tiene problemas, o si S3 está caído`,
        good:
`# Fake: implementación en memoria que se comporta como la real
class InMemoryReportStorage:
    def __init__(self): self.stored = {}
    def save(self, name: str, content: bytes): self.stored[name] = content
    def get(self, name: str) -> bytes: return self.stored[name]

# Spy: registra llamadas para verificarlas en el test
class SpyMailer:
    def __init__(self): self.sent = []
    def send(self, to: str, subject: str, body: str):
        self.sent.append({"to": to, "subject": subject})

def test_generate_and_send_report():
    storage = InMemoryReportStorage()
    mailer = SpyMailer()
    service = ReportService(db=FakeDB(), mailer=mailer, storage=storage)

    service.generate_and_send("sales", recipient="team@company.com")

    assert "sales" in storage.stored
    assert len(mailer.sent) == 1
    assert mailer.sent[0]["to"] == "team@company.com"`,
      },
          {
        lang: 'java', label: 'Java',
        bad:
`// Test acoplado a implementaciones reales: necesita DB, SMTP y S3
class ReportServiceTest {
    @Test
    void shouldGenerateAndSendReport() {
        ReportService service = new ReportService(
            new PostgresDataSource("jdbc:postgresql://localhost/testdb"),
            new SMTPMailer("smtp.gmail.com", 587),
            new S3Storage("prod-bucket")
        );
        // Falla si no hay DB, si Gmail no responde, o si S3 está caído
        service.generateAndSend("sales", "team@company.com");
    }
}`,
        good:
`// Fake + Spy: tests rápidos, deterministas y sin infraestructura
class InMemoryReportStorage implements ReportStorage {
    Map<String, byte[]> stored = new HashMap<>();
    public void save(String name, byte[] content) { stored.put(name, content); }
    public byte[] get(String name) { return stored.get(name); }
}

class SpyMailer implements Mailer {
    List<String> recipients = new ArrayList<>();
    public void send(String to, String subject, String body) { recipients.add(to); }
}

class ReportServiceTest {
    @Test
    void generatesReportAndSendsEmail() {
        InMemoryReportStorage storage = new InMemoryReportStorage();
        SpyMailer mailer = new SpyMailer();
        ReportService service = new ReportService(new FakeDataSource(), mailer, storage);

        service.generateAndSend("sales", "team@company.com");

        assertTrue(storage.stored.containsKey("sales"));
        assertEquals(1, mailer.recipients.size());
        assertEquals("team@company.com", mailer.recipients.get(0));
    }
}`,
      },
    ],
  },

  {
    id: 'observabilidad',
    category: 'SISTEMAS',
    icon: '🔭',
    title: 'Observabilidad',
    description: 'Entender qué está pasando dentro de un sistema a partir de lo que expone. Tres pilares: logs estructurados, métricas y trazas distribuidas.',
    solves: 'Bugs en producción imposibles de reproducir, debugging a ciegas, y sistemas distribuidos donde no sabes en qué servicio está fallando algo.',
    detail: 'La observabilidad significa poder responder "¿qué está pasando?" sin reproducir el problema localmente.\n\n**Logs estructurados:** JSON con campos definidos (timestamp, nivel, traceId). Son buscables y analizables.\n\n**Métricas:** latencia, tasa de errores, uso de CPU, requests por segundo.\n\n**Trazas distribuidas:** siguen una request a través de todos los servicios.\n\nLa diferencia con monitoreo: el monitoreo dice cuándo algo falla; la observabilidad permite entender por qué.',
    points: [
      'Los logs sin estructura son casi tan inútiles como no tener logs',
      'Agrega un traceId a cada request — te salvará en producción',
      'Las métricas de negocio son tan importantes como las técnicas',
      'OpenTelemetry es el estándar abierto que unifica logs, métricas y trazas',
    ],
    codeExamples: [
      {
        lang: 'typescript', label: 'TypeScript',
        bad:
`// Logs sin estructura: imposibles de buscar, filtrar o analizar
async function processPayment(paymentId: string, amount: number) {
  try {
    console.log('processing payment')        // ¿qué payment?
    await gateway.charge(paymentId, amount)
    console.log('done')                      // ¿cuánto tardó?
  } catch (error) {
    console.log('error: ' + error.message)  // sin contexto útil
  }
}`,
        good:
`// Logs estructurados: cada campo es buscable y correlacionable
async function processPayment(paymentId: string, amount: number, ctx: RequestContext) {
  const log = logger.child({ traceId: ctx.traceId, userId: ctx.userId, paymentId })

  log.info('payment.started', { amount, currency: 'CLP' })
  const start = Date.now()

  try {
    await gateway.charge(paymentId, amount)
    log.info('payment.succeeded', { durationMs: Date.now() - start })
    metrics.increment('payments.success', { method: 'card' })
  } catch (error) {
    log.error('payment.failed', {
      durationMs: Date.now() - start,
      errorCode: error.code,
      errorMessage: error.message,
    })
    metrics.increment('payments.failure', { errorCode: error.code })
    throw error
  }
}`,
      },
      {
        lang: 'python', label: 'Python',
        bad:
`# Logging sin contexto: inútil cuando hay miles de requests concurrentes
def process_order(order_id: str):
    print("Procesando orden")           # sin order_id, sin traceId
    try:
        order = db.get_order(order_id)
        inventory.reserve(order)
        print("Listo")
    except Exception as e:
        print("Error: " + str(e))       # ¿cuál orden? ¿en qué paso?`,
        good:
`import structlog

logger = structlog.get_logger()

def process_order(order_id: str, trace_id: str, user_id: str):
    log = logger.bind(trace_id=trace_id, user_id=user_id, order_id=order_id)
    log.info("order.processing_started")
    start = time.monotonic()
    try:
        order = db.get_order(order_id)
        log.info("order.fetched", item_count=len(order.items))

        inventory.reserve(order)
        log.info("order.inventory_reserved")

        duration_ms = int((time.monotonic() - start) * 1000)
        log.info("order.processing_completed", duration_ms=duration_ms)
        metrics.histogram("order.processing_duration", duration_ms)
    except InventoryError as e:
        log.warning("order.inventory_unavailable", product_id=e.product_id)
        raise
    except Exception as e:
        log.error("order.processing_failed", error=str(e), exc_info=True)
        raise`,
      },
      {
        lang: 'bash', label: 'Shell / Config',
        bad:
`# Sin trazas distribuidas: buscar un error entre servicios es una pesadilla
# Service A log:
{"level":"error","message":"Request failed"}

# Service B log (¿es el mismo request? imposible saberlo):
{"level":"error","message":"DB timeout"}

# Grep en producción a ciegas:
ssh prod-server-1 "grep error /var/log/app.log | tail -100"
ssh prod-server-2 "grep error /var/log/app.log | tail -100"`,
        good:
`# Con OpenTelemetry: cada request tiene un traceId que lo atraviesa todo
# Service A — genera el traceId al inicio del request
{"level":"info","traceId":"abc-123","spanId":"1a","service":"api-gateway","event":"request.received","path":"/orders"}

# Service B — propaga el mismo traceId
{"level":"info","traceId":"abc-123","spanId":"2b","service":"order-service","event":"order.created"}

# Service C — mismo traceId, podemos ver el flujo completo
{"level":"error","traceId":"abc-123","spanId":"3c","service":"inventory","event":"stock.unavailable","productId":"p-456"}

# En Grafana/Jaeger: busca traceId=abc-123 y ves el flujo completo
# con timing de cada servicio, sin SSH, sin grep`,
      },
          {
        lang: 'java', label: 'Java',
        bad:
`// Logs sin estructura: imposibles de correlacionar en producción
public void processPayment(String paymentId, double amount) {
    try {
        System.out.println("processing payment");   // ¿cuál? ¿de quién?
        gateway.charge(paymentId, amount);
        System.out.println("done");                 // ¿cuánto tardó?
    } catch (Exception e) {
        System.out.println("error: " + e.getMessage()); // sin contexto útil
    }
}`,
        good:
`// Logs estructurados con SLF4J + contexto completo
private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

public void processPayment(String paymentId, double amount, RequestContext ctx) {
    MDC.put("traceId", ctx.getTraceId());
    MDC.put("userId", ctx.getUserId());
    MDC.put("paymentId", paymentId);

    log.info("payment.started", StructuredArguments.kv("amount", amount));
    long start = System.currentTimeMillis();

    try {
        gateway.charge(paymentId, amount);
        long duration = System.currentTimeMillis() - start;
        log.info("payment.succeeded", StructuredArguments.kv("durationMs", duration));
        metrics.increment("payments.success");
    } catch (PaymentException e) {
        long duration = System.currentTimeMillis() - start;
        log.error("payment.failed",
            StructuredArguments.kv("durationMs", duration),
            StructuredArguments.kv("errorCode", e.getCode()), e);
        metrics.increment("payments.failure");
        throw e;
    } finally {
        MDC.clear();
    }
}`,
      },
    ],
  },

  {
    id: '12factor',
    category: 'SISTEMAS',
    icon: '📋',
    title: '12-Factor App',
    description: 'Doce prácticas para construir aplicaciones SaaS portables, resilientes y fáciles de escalar. Resuelven los problemas más comunes de operación.',
    solves: 'Apps que solo funcionan en una máquina, configuración hardcodeada en el código y deploys frágiles que no se pueden repetir.',
    detail: 'La metodología fue desarrollada por Heroku y captura las mejores prácticas para apps en la nube.\n\n**Factor III — Configuración en variables de entorno:** nada de URLs de DB, API keys ni ambientes en el código.\n\n**Factor VI — Procesos sin estado:** el estado va en servicios externos. Permite escalar horizontalmente.\n\n**Factor XI — Logs como streams:** escribe a stdout, la infraestructura se encarga del resto.',
    points: [
      'Las variables de entorno son la forma correcta de manejar configuración por ambiente',
      'Un proceso sin estado puede reiniciarse en cualquier momento sin consecuencias',
      'Escribir a stdout en vez de archivos hace los logs infinitamente más manejables',
      'Si necesitas SSH al servidor para diagnosticar, te falta observabilidad',
    ],
    codeExamples: [
      {
        lang: 'typescript', label: 'TypeScript',
        bad:
`// Factor III violado: configuración hardcodeada por ambiente
const DB_CONFIG = {
  host: 'prod-db.company.internal',  // diferente en dev vs prod
  port: 5432,
  user: 'app_user',
  password: 'S3cr3t_Pr0d_Pass',      // credencial en el código 🚨
  database: 'production_db',
}

const REDIS_URL = 'redis://prod-redis.company.internal:6379'
const STRIPE_KEY = 'sk_live_abc123...'  // key de producción en el repo`,
        good:
`// Factor III: configuración desde variables de entorno
// El mismo binario funciona en dev, staging y producción
function loadConfig() {
  const required = ['DATABASE_URL', 'REDIS_URL', 'STRIPE_SECRET_KEY']
  const missing = required.filter(key => !process.env[key])
  if (missing.length > 0) throw new Error('Missing env vars: ' + missing.join(', '))

  return {
    db: { url: process.env.DATABASE_URL },
    redis: { url: process.env.REDIS_URL },
    stripe: { key: process.env.STRIPE_SECRET_KEY },
    app: {
      port: Number(process.env.PORT ?? 3000),
      env: process.env.NODE_ENV ?? 'development',
    },
  }
}`,
      },
      {
        lang: 'python', label: 'Python',
        bad:
`# Factor VI violado: estado local entre requests
import os

# Archivo local para tracking de sesiones — no funciona con múltiples instancias
SESSIONS_FILE = "/tmp/active_sessions.json"

def create_session(user_id: str) -> str:
    sessions = json.load(open(SESSIONS_FILE))  # estado en disco local
    session_id = generate_id()
    sessions[session_id] = user_id
    json.dump(sessions, open(SESSIONS_FILE, "w"))
    return session_id

def get_session(session_id: str) -> str:
    sessions = json.load(open(SESSIONS_FILE))  # otra instancia no tiene este archivo
    return sessions.get(session_id)`,
        good:
`# Factor VI: procesos sin estado — el estado va en Redis (servicio externo)
import redis
import os

redis_client = redis.from_url(os.environ["REDIS_URL"])
SESSION_TTL = 3600  # 1 hora

def create_session(user_id: str) -> str:
    session_id = generate_id()
    redis_client.setex(f"session:{session_id}", SESSION_TTL, user_id)
    return session_id

def get_session(session_id: str) -> str | None:
    value = redis_client.get(f"session:{session_id}")
    return value.decode() if value else None

# Ahora puedes tener 10 instancias del proceso — todas comparten el estado en Redis`,
      },
      {
        lang: 'bash', label: 'Shell / Config',
        bad:
`# Sin .env bien configurado: variables de ambiente mezcladas con defaults peligrosos
# config.sh cargado en todos los ambientes
export DB_HOST="prod-db.internal"   # apunta a producción siempre
export SECRET_KEY="changeme"         # default inseguro
export DEBUG="false"                 # ¿y en desarrollo?

# Logs a archivo: se llena el disco, no funciona en contenedores
app.py >> /var/log/myapp/app.log 2>&1`,
        good:
`# .env.example en el repo (sin valores reales)
DATABASE_URL=postgres://user:password@localhost:5432/myapp_dev
REDIS_URL=redis://localhost:6379
SECRET_KEY=generate-a-real-secret-here
PORT=8000
DEBUG=true

# .env real en cada máquina (en .gitignore)
# Producción usa variables del sistema (inyectadas por Kubernetes/ECS/Heroku)

# Factor XI: logs como stream, sin archivos
# docker-compose.yml
services:
  app:
    image: myapp
    command: python -m uvicorn main:app --host 0.0.0.0
    # stdout/stderr son capturados por Docker automáticamente
    # en producción van a CloudWatch / Datadog / Loki`,
      },
          {
        lang: 'java', label: 'Java',
        bad:
`// Factor III violado: configuración hardcodeada por ambiente
public class DatabaseConfig {
    // Credenciales de producción en el código fuente 🚨
    private static final String DB_URL = "jdbc:postgresql://prod-db.internal:5432/production";
    private static final String DB_USER = "app_user";
    private static final String DB_PASSWORD = "S3cr3t_Pr0d_Pass";

    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
    }
}

// Factor VI violado: estado en memoria compartida entre requests
public class SessionManager {
    private static final Map<String, String> sessions = new HashMap<>(); // no thread-safe
    public static void store(String id, String userId) { sessions.put(id, userId); }
}`,
        good:
`// Factor III: configuración desde variables de entorno
public class DatabaseConfig {
    private final String dbUrl;
    private final String dbUser;
    private final String dbPassword;

    public DatabaseConfig() {
        this.dbUrl = requireEnv("DATABASE_URL");
        this.dbUser = requireEnv("DB_USER");
        this.dbPassword = requireEnv("DB_PASSWORD");
    }

    private String requireEnv(String key) {
        String value = System.getenv(key);
        if (value == null) throw new IllegalStateException("Missing env var: " + key);
        return value;
    }
}

// Factor VI: estado en Redis, no en memoria local
@Service
public class SessionService {
    private final RedisTemplate<String, String> redis;
    private static final Duration TTL = Duration.ofHours(1);

    public String createSession(String userId) {
        String sessionId = UUID.randomUUID().toString();
        redis.opsForValue().set("session:" + sessionId, userId, TTL);
        return sessionId;
    }
}`,
      },
    ],
  },

  {
    id: 'concurrencia',
    category: 'SISTEMAS',
    icon: '⚡',
    title: 'Concurrencia',
    description: 'Múltiples tareas que comparten recursos al mismo tiempo. Introduce race conditions y deadlocks que son difíciles de reproducir.',
    solves: 'Bugs intermitentes imposibles de reproducir, datos corruptos bajo carga y código que pasa todos los tests pero falla en producción.',
    detail: 'La concurrencia ocurre cuando múltiples partes del código acceden a los mismos recursos simultáneamente.\n\n**Race condition:** dos procesos leen y modifican el mismo dato al mismo tiempo y el resultado depende de quién llegó primero.\n\n**Deadlock:** dos procesos esperan uno al otro para liberar un recurso y ninguno avanza.\n\n**Soluciones:** mutex, operaciones atómicas, transacciones con el nivel de aislamiento correcto, Actor Model.',
    points: [
      'Los bugs de concurrencia son los más difíciles de reproducir porque dependen del timing',
      'Preferir inmutabilidad reduce drásticamente los problemas de concurrencia',
      'Las transacciones de DB tienen niveles de aislamiento — conoce cuál estás usando',
      'El Actor Model y los canales son abstracciones que hacen la concurrencia más manejable',
    ],
    codeExamples: [
      {
        lang: 'typescript', label: 'TypeScript',
        bad:
`// Race condition clásica: dos requests compran el último producto a la vez
async function purchaseProduct(productId: string, userId: string) {
  const product = await db.findOne('products', productId)

  // Entre este check y el update, otro request puede pasar el mismo check
  if (product.stock < 1) throw new Error('Sin stock')

  // PROBLEMA: dos requests pueden ejecutar esto simultáneamente
  await db.update('products', productId, { stock: product.stock - 1 })
  await db.insert('orders', { userId, productId })
}`,
        good:
`// Solución 1: operación atómica en la DB (no hay ventana de race condition)
async function purchaseProduct(productId: string, userId: string) {
  // UPDATE atómico con check de stock: si stock=0, afecta 0 filas
  const result = await db.query(
    'UPDATE products SET stock = stock - 1 WHERE id = ? AND stock > 0',
    [productId]
  )
  if (result.affectedRows === 0) throw new Error('Sin stock')
  await db.insert('orders', { userId, productId })
}

// Solución 2: bloqueo pesimista con SELECT FOR UPDATE
async function purchaseProductWithLock(productId: string, userId: string) {
  return db.transaction(async (tx) => {
    const [product] = await tx.query(
      'SELECT * FROM products WHERE id = ? FOR UPDATE',
      [productId]
    )
    if (product.stock < 1) throw new Error('Sin stock')
    await tx.query('UPDATE products SET stock = ? WHERE id = ?', [product.stock - 1, productId])
    await tx.query('INSERT INTO orders (user_id, product_id) VALUES (?, ?)', [userId, productId])
  })
}`,
      },
      {
        lang: 'python', label: 'Python',
        bad:
`# Race condition en contador compartido entre threads
import threading

counter = 0  # estado compartido sin protección

def increment_counter():
    global counter
    for _ in range(100_000):
        # read-modify-write no es atómica: dos threads pueden leer el mismo valor
        counter += 1

threads = [threading.Thread(target=increment_counter) for _ in range(10)]
for t in threads: t.start()
for t in threads: t.join()

print(counter)  # esperado: 1_000_000 — real: algo menor, no determinista`,
        good:
`# Solución con Lock: solo un thread modifica el contador a la vez
import threading

counter = 0
lock = threading.Lock()

def increment_counter():
    global counter
    for _ in range(100_000):
        with lock:  # garantiza acceso exclusivo a la sección crítica
            counter += 1

# Mejor aún: usar primitivas atómicas cuando el lenguaje las provee
from multiprocessing import Value

counter = Value('i', 0)  # entero compartido y atómico

def increment_atomic():
    for _ in range(100_000):
        with counter.get_lock():
            counter.value += 1

# En código de aplicación web: dejar la concurrencia a la DB
# UPDATE accounts SET balance = balance - ? WHERE id = ? AND balance >= ?`,
      },
          {
        lang: 'java', label: 'Java',
        bad:
`// Race condition clásica: dos threads decrementan el mismo contador
public class TicketService {
    private int availableTickets = 100;

    public boolean purchase(String userId) {
        // read-check-write no es atómica: dos threads pueden pasar el check
        if (availableTickets <= 0) return false;
        availableTickets--;  // PROBLEMA: no atómico
        db.save(new Purchase(userId));
        return true;
    }
}

// Resultado bajo carga: availableTickets puede quedar negativo`,
        good:
`// Solución 1: AtomicInteger para operaciones atómicas sin bloqueo
public class TicketService {
    private final AtomicInteger availableTickets = new AtomicInteger(100);

    public boolean purchase(String userId) {
        // compareAndDecrement es atómico — no hay race condition
        int remaining = availableTickets.decrementAndGet();
        if (remaining < 0) {
            availableTickets.incrementAndGet(); // revertimos
            return false;
        }
        db.save(new Purchase(userId));
        return true;
    }
}

// Solución 2: dejar la concurrencia a la DB (más robusta en producción)
public boolean purchaseWithDbLock(String userId) {
    // UPDATE atómico con check: 0 filas afectadas = sin tickets
    int affected = jdbcTemplate.update(
        "UPDATE events SET tickets = tickets - 1 WHERE id = ? AND tickets > 0",
        eventId
    );
    if (affected == 0) return false;
    db.save(new Purchase(userId));
    return true;
}`,
      },
    ],
  },

  {
    id: 'git-avanzado',
    category: 'COLABORACION',
    icon: '🌿',
    title: 'Git Avanzado',
    description: 'Más allá de commit y push: estrategias de branching, rebase interactivo, bisect para encontrar bugs y convenciones para historiales legibles.',
    solves: 'Historiales que no cuentan nada, merges traumáticos de branches largas y no poder saber cuándo se introdujo un bug.',
    detail: 'Git es la herramienta de colaboración central. Usarlo bien va más allá de los comandos básicos.\n\n**Trunk-Based Development:** todos trabajan en main con ramas muy cortas, integrando varias veces al día.\n\n**Rebase interactivo:** reorganiza commits antes de compartirlos para un historial coherente.\n\n**git bisect:** búsqueda binaria que encuentra el commit que introdujo un bug en segundos.\n\n**Conventional Commits:** convención (feat:, fix:, chore:) que permite generar changelogs automáticamente.',
    points: [
      'Un buen mensaje de commit explica por qué se hizo el cambio, no qué se cambió',
      'Ramas que viven más de dos días son una deuda de integración',
      'git bisect puede encontrar el commit culpable de un bug en segundos',
      'El historial de commits es documentación — trátalo como tal',
    ],
    codeExamples: [
      {
        lang: 'bash', label: 'Shell / Git',
        bad:
`# Historial de commits que no cuenta nada
git log --oneline
# a1b2c3d fix
# e4f5g6h changes
# i7j8k9l wip
# m1n2o3p asdfgh
# q4r5s6t update stuff
# u7v8w9x final final FINAL
# y1z2a3b ok this should work

# Branch que lleva 3 semanas sin integrar
git checkout feature/new-checkout-redesign
# Última sincronización con main: hace 21 días
# Merge conflict en 47 archivos cuando intentas integrar`,
        good:
`# Historial con Conventional Commits: legible y automatizable
git log --oneline
# a1b2c3d feat(checkout): add regional discount calculation
# e4f5g6h fix(auth): prevent session fixation on password reset
# i7j8k9l refactor(orders): extract OrderTotal value object
# m1n2o3p test(inventory): add edge cases for concurrent stock updates
# q4r5s6t docs(api): update OpenAPI spec for /orders endpoint
# u7v8w9x chore(deps): update stripe-js to v3.5.0

# Trunk-based: rama corta, merge en 2 días máximo
git checkout -b feat/regional-discounts
# día 1: implementación
git commit -m "feat(pricing): add RegionalDiscountService"
# día 2: tests + PR
git commit -m "test(pricing): add unit tests for regional discounts"

# Encontrar cuándo se rompió algo con bisect
git bisect start
git bisect bad HEAD
git bisect good v1.4.0
# Git automáticamente encuentra el commit culpable en ~10 pasos`,
      },
    ],
  },

  {
    id: 'code-review',
    category: 'COLABORACION',
    icon: '👁️',
    title: 'Code Review',
    description: 'Revisión entre pares para detectar problemas, compartir conocimiento y mantener la coherencia del código base.',
    solves: 'Bugs que llegan a producción, conocimiento silado en una persona y equipos donde los PR se aprueban sin leer.',
    detail: 'El code review no es solo encontrar bugs — es una de las formas más efectivas de transferir conocimiento.\n\n**Qué revisar:** diseño, legibilidad, tests, edge cases, seguridad.\n\n**Cómo dar feedback:** comenta el código, no a la persona. Distingue entre bloqueadores y sugerencias.\n\n**El tamaño importa:** PRs de más de 400 líneas se revisan superficialmente. Divídelos.',
    points: [
      'PRs pequeños y frecuentes reciben mejores revisiones que PRs grandes y raros',
      'Los comentarios son preguntas y sugerencias, no órdenes',
      'Aprobar sin leer es peor que no hacer review — da falsa sensación de seguridad',
      'El review sirve para aprender — tanto quien revisa como quien es revisado',
    ],
    codeExamples: [
      {
        lang: 'typescript', label: 'TypeScript',
        bad:
`// Código bajo review:
function getUsers(filters: any) {
  return db.query('SELECT * FROM users WHERE ' + filters)
}

// Comentarios de review que no ayudan:
// Reviewer: "esto está mal"
// Reviewer: "arregla esto"
// Reviewer: "no hagas así"
// Reviewer: "performance"
// ❌ Sin contexto, sin alternativa, sin tono constructivo`,
        good:
`// Código bajo review:
function getUsers(filters: any) {
  return db.query('SELECT * FROM users WHERE ' + filters)
}

// Comentarios de review constructivos:

// [BLOQUEANTE] Hay una SQL injection acá — si filters viene del cliente,
// un atacante puede ejecutar cualquier query.
// Usa parametrización:
//   db.query('SELECT * FROM users WHERE status = ?', [filters.status])

// [SUGERENCIA] El tipo 'any' hace que TypeScript no pueda ayudarte.
// Considera definir la interfaz:
//   interface UserFilters { status?: 'active' | 'inactive'; role?: string }

// [PREGUNTA] ¿Necesitamos todos los campos? SELECT * puede ser costoso
// si la tabla crece. ¿Qué campos usa el cliente de esta función?`,
      },
    ],
  },

  {
    id: 'adrs',
    category: 'COLABORACION',
    icon: '📝',
    title: 'ADRs',
    description: 'Architecture Decision Records: documentos cortos que registran una decisión técnica, su contexto, las alternativas y sus consecuencias. Viven en el repositorio.',
    solves: 'Decisiones de diseño que nadie recuerda por qué se tomaron y equipos nuevos que repiten discusiones ya resueltas.',
    detail: 'Un ADR responde a "¿por qué hicimos esto así?" — respuesta que suele estar en la cabeza de alguien que ya no está en el equipo.\n\n**Estructura:** Contexto (qué problema existía), Decisión, Alternativas descartadas, Consecuencias.\n\n**Dónde viven:** en docs/decisions/ con el mismo review que el código.\n\n**No es un RFC:** es breve, directo y documenta la decisión ya tomada.',
    points: [
      'Una página es suficiente — no es un documento de arquitectura completo',
      'Documentar por qué se descartó una alternativa evita que el equipo la proponga de nuevo',
      'Los ADRs en el repositorio sobreviven la rotación del equipo',
      'Empezar hoy no requiere ninguna herramienta especial',
    ],
    codeExamples: [
      {
        lang: 'bash', label: 'Markdown / Repo',
        bad:
`# Sin ADR: la decisión queda en un hilo de Slack de hace 18 meses

# En el código solo hay un comentario críptico:
# database.ts
# Using MongoDB here — Carlos said so (2023)

# Consecuencias:
# - 6 meses después nadie sabe por qué se eligió MongoDB
# - El equipo debate migrar a PostgreSQL sin saber qué problemas resolvió Mongo
# - Se repiten los mismos argumentos del debate original
# - Finalmente se migra, descubriendo que había razones válidas para Mongo`,
        good:
`# docs/decisions/0004-use-mongodb-for-product-catalog.md

# ADR-0004: Usar MongoDB para el catálogo de productos

## Estado
Aceptada — 2024-03-15

## Contexto
El catálogo de productos tiene atributos muy variables según categoría:
un zapato tiene talla y color; un libro tiene ISBN y autor; un electrónico
tiene voltaje y conectividad. Un schema relacional fijo requeriría 20+ columnas
nullable o una tabla EAV difícil de consultar.

## Decisión
Usar MongoDB para el servicio de catálogo. Los demás servicios
(órdenes, usuarios, pagos) continúan en PostgreSQL.

## Alternativas descartadas
- **PostgreSQL con JSONB**: evaluado, pero las queries sobre atributos
  anidados son más complejas y el equipo no tiene experiencia con índices GIN.
- **PostgreSQL con tabla EAV**: descartado por complejidad de consultas
  y dificultad para validar tipos por categoría.

## Consecuencias
✅ Schema flexible por categoría de producto
✅ Equipo tiene experiencia con MongoDB
⚠️  Consistencia eventual entre catálogo y órdenes requiere manejo explícito
⚠️  Sin joins nativos — las queries cruzadas con órdenes se hacen en código`,
      },
    ],
  },

  {
    id: 'tradeoffs',
    category: 'SISTEMICO',
    icon: '⚖️',
    title: 'Trade-offs Explícitos',
    description: 'Evaluar soluciones como compensaciones entre atributos: performance, legibilidad, seguridad, velocidad de desarrollo. No como correcta vs incorrecta.',
    solves: 'Debates técnicos sin fin, adopción de tecnologías por moda y arquitecturas que optimizan una dimensión a expensas ocultas de las demás.',
    detail: 'Cada elección implica ganar algo y perder algo. El problema no es que existan trade-offs — es cuando no son explícitos.\n\n**Ejemplos:** consistencia vs disponibilidad (teorema CAP), performance vs legibilidad, flexibilidad vs simplicidad.\n\n**Cómo hacerlos explícitos:** lista los atributos que importan en tu contexto y evalúa cada opción. No hay respuesta correcta universal.',
    points: [
      'No existen las mejores prácticas universales, solo prácticas adecuadas a un contexto',
      'El teorema CAP es el ejemplo más famoso: no puedes tener todo al mismo tiempo',
      'Hacer explícito un trade-off convierte un debate interminable en una decisión documentable',
      'La deuda técnica es un trade-off: velocidad hoy vs costo mañana',
    ],
    codeExamples: [
      {
        lang: 'typescript', label: 'TypeScript',
        bad:
`// Decisión técnica sin trade-offs explícitos
// PR description: "Migré la caché a Redis porque Redis es mejor"
// (¿mejor en qué? ¿para qué caso? ¿qué sacrificamos?)

// Resultado: solución que optimiza latencia a costo de complejidad operacional
// que nadie en el equipo discutió ni aprobó explícitamente
const cache = new RedisCluster({
  nodes: [...],
  maxRetriesPerRequest: 3,
  // Configuración que nadie entiende del todo
})`,
        good:
`// Trade-offs documentados antes de decidir
/*
  DECISIÓN: Estrategia de caché para el endpoint /products

  Opción A — In-memory (Map):
    ✅ Cero latencia, sin infraestructura extra
    ❌ No compartida entre instancias, se pierde al reiniciar

  Opción B — Redis:
    ✅ Compartida entre instancias, persiste reinicios
    ❌ Latencia de red (~1ms), dependencia operacional nueva

  Opción C — Sin caché:
    ✅ Sin complejidad
    ❌ DB recibe 500 req/s innecesarios

  Contexto: tenemos 3 instancias en producción, los productos cambian
  cada 10 minutos, el equipo ya opera Redis para sesiones.

  DECISIÓN: Redis (Opción B) — la infraestructura ya existe, la latencia
  es aceptable y la consistencia entre instancias es necesaria.
*/

// Ahora el equipo entiende por qué, y puede reevaluar si el contexto cambia`,
      },
      {
        lang: 'python', label: 'Python',
        bad:
`# Elegir entre consistencia y disponibilidad sin saber el trade-off
# Se configura PostgreSQL con SERIALIZABLE isolation sin entender el costo
engine = create_engine(DB_URL, isolation_level="SERIALIZABLE")

# En producción: deadlocks frecuentes bajo carga concurrente
# El equipo no sabía que SERIALIZABLE sacrifica throughput por consistencia`,
        good:
`# Trade-off explícito: documentado en el código y en el ADR
# Ver ADR-0007: elección de isolation level para transacciones de inventario

# READ COMMITTED (default):
# ✅ Alto throughput, pocos bloqueos
# ❌ Puede leer datos que otra transacción aún no confirmó
engine_default = create_engine(DB_URL)  # isolation_level="READ COMMITTED"

# REPEATABLE READ:
# ✅ Protege contra non-repeatable reads
# ❌ Mayor contención, posibles deadlocks bajo alta concurrencia
engine_inventory = create_engine(DB_URL, isolation_level="REPEATABLE READ")

# SERIALIZABLE:
# ✅ Máxima consistencia, como si las transacciones fueran secuenciales
# ❌ Menor throughput, deadlocks frecuentes bajo carga
engine_financial = create_engine(DB_URL, isolation_level="SERIALIZABLE")

# Decisión: cada contexto usa el nivel apropiado para sus necesidades`,
      },
          {
        lang: 'java', label: 'Java',
        bad:
`// Decisión sin trade-offs explícitos: migramos a microservicios "porque escala mejor"
// Resultado: 12 servicios para una app con 50 usuarios concurrentes

// Antes (monolito, 2 semanas para implementar):
@Service public class OrderService {
    public Order placeOrder(OrderRequest req) { ... }
}

// Después (microservicios, 3 meses para implementar):
// OrderService → llama a InventoryService → llama a PricingService
// → llama a UserService → llama a NotificationService
// Latencia: 2ms → 85ms. Deploys: 1 → 12. Debugging: trivial → pesadilla`,
        good:
`// Trade-offs documentados antes de decidir la arquitectura
/*
  DECISIÓN: Arquitectura para el módulo de pagos

  Opción A — Módulo dentro del monolito:
    ✅ Sin latencia de red, transacciones ACID nativas
    ✅ Un solo deploy, debugging simple
    ❌ El equipo de pagos comparte ciclo de release con el resto

  Opción B — Microservicio independiente:
    ✅ Deploy independiente, tecnología propia (necesitamos Go para crypto)
    ✅ Aislamiento de fallos: un bug en pagos no cae todo el sistema
    ❌ Latencia de red, consistencia eventual, complejidad operacional

  Contexto: equipo de pagos de 5 personas, 3 deploys/semana independientes,
  regulación PCI-DSS requiere aislamiento de datos de tarjetas.

  DECISIÓN: Microservicio (Opción B) — el aislamiento regulatorio
  justifica la complejidad. Usaremos sagas para consistencia eventual.
*/
@RestController
public class PaymentServiceClient {
    // Comunicación explícita vía HTTP, con circuit breaker
    @CircuitBreaker(name = "payments", fallbackMethod = "paymentFallback")
    public PaymentResult processPayment(PaymentRequest req) { ... }
}`,
      },
    ],
  },

  {
    id: 'complejidad',
    category: 'SISTEMICO',
    icon: '🧶',
    title: 'Complejidad Esencial vs Accidental',
    description: 'La esencial viene del problema y no se puede eliminar. La accidental la introduce el código con abstracciones innecesarias — y sí se puede reducir.',
    solves: 'Sistemas imposibles de mantener no porque el dominio sea difícil, sino porque el código acumuló capas de indirección que no aportan nada.',
    detail: 'Esta distinción la hizo Fred Brooks en "No Silver Bullet" y fue profundizada por Moseley y Marks en "Out of the Tar Pit".\n\n**Esencial:** viene del dominio. Calcular impuestos es complejo porque las reglas tributarias lo son. No puedes simplificarlo.\n\n**Accidental:** la introduce el propio código. Diez capas de indirección para algo simple, patrones aplicados sin necesidad.\n\n**Reconocerla:** si el código es difícil y el dominio no lo es, hay complejidad accidental.',
    points: [
      'La esencial se modela bien; la accidental se elimina',
      'Una abstracción que no simplifica nada solo agrega complejidad accidental',
      '¿El código es difícil porque el problema lo es, o porque lo hicimos difícil?',
      '"Out of the Tar Pit" es una lectura obligada para profundizar en este concepto',
    ],
    codeExamples: [
      {
        lang: 'typescript', label: 'TypeScript',
        bad:
`// Complejidad accidental: 5 clases para validar un email
interface Validatable { validate(): ValidationResult }
abstract class AbstractValidator<T> implements Validatable {
  abstract validate(): ValidationResult
}
class EmailFormatValidator extends AbstractValidator<string> {
  constructor(private readonly emailValidatorStrategy: IEmailValidatorStrategy) { super() }
  validate(): ValidationResult {
    return this.emailValidatorStrategy.execute(this.value)
  }
}
// ... 3 interfaces y 2 clases más para llegar a: email.includes('@')`,
        good:
`// El problema (validar email) no es complejo — la solución tampoco debería serlo
function isValidEmail(email: string): boolean {
  return email.includes('@') && email.includes('.')
}

// Si el negocio necesita más reglas, el código crece en proporción a esa complejidad
// No en proporción a cuántos patrones de diseño conocemos`,
      },
      {
        lang: 'python', label: 'Python',
        bad:
`# Complejidad accidental: arquitectura de 4 capas para un script de conversión
class CurrencyConverterFactory:
    def create(self, strategy: str) -> "CurrencyConverterStrategy": ...

class CurrencyConverterStrategy(ABC):
    @abstractmethod
    def convert(self, amount: float, rate: float) -> float: ...

class StandardCurrencyConverterStrategy(CurrencyConverterStrategy):
    def convert(self, amount: float, rate: float) -> float:
        return amount * rate  # esta es toda la lógica

class CurrencyConverterFacade:
    def __init__(self, factory: CurrencyConverterFactory): ...
    def convert_currency(self, amount, from_currency, to_currency): ...`,
        good:
`# La complejidad esencial del problema es: amount * rate
def convert_currency(amount: float, from_currency: str, to_currency: str) -> float:
    rate = exchange_rates.get(from_currency, to_currency)
    return amount * rate

# Si el negocio evoluciona (fees, rounding rules, auditoría), el código evoluciona
# con esa complejidad real — no porque hayamos anticipado capas que no necesitábamos`,
      },
          {
        lang: 'java', label: 'Java',
        bad:
`// Complejidad accidental: arquitectura de 6 clases para validar un email
public interface ValidationRule<T> { ValidationResult apply(T value); }
public abstract class AbstractValidator<T> {
    protected abstract List<ValidationRule<T>> rules();
    public ValidationResult validate(T value) { ... }
}
public class EmailValidationRuleFactory {
    public ValidationRule<String> createFormatRule() { ... }
    public ValidationRule<String> createDomainRule() { ... }
}
public class EmailValidatorImpl extends AbstractValidator<String> {
    // ... 40 líneas más para llegar a: email.contains("@")
}`,
        good:
`// El problema no es complejo — la solución tampoco debería serlo
public class EmailValidator {
    public static boolean isValid(String email) {
        return email != null
            && email.contains("@")
            && email.contains(".");
    }
}

// Si el negocio evoluciona y necesita regex complejo, lo agregamos entonces
// No construimos la abstracción antes de necesitarla (YAGNI)`,
      },
    ],
  },

  {
    id: 'diseno-para-el-cambio',
    category: 'SISTEMICO',
    icon: '🌱',
    title: 'Diseño para el Cambio',
    description: 'El software siempre va a cambiar. Diseñar con eso en mente: fronteras claras, interfaces estables y bajo acoplamiento en todos los niveles.',
    solves: 'El miedo a tocar código existente, nuevas features que requieren cambios en cascada y arquitecturas que se vuelven más rígidas con cada iteración.',
    detail: 'El único sistema que no cambia es el que ya no se usa. Diseñar para el cambio no es adivinar el futuro — es crear condiciones para que los cambios sean locales y seguros.\n\n**Interfaces estables:** los detalles de implementación pueden cambiar; la interfaz pública debe ser estable.\n\n**Open/Closed en la práctica:** un nuevo tipo de pago no debería requerir modificar la lógica existente.\n\n**El costo del sobre-diseño:** anticipar cambios que nunca ocurren genera complejidad accidental.',
    points: [
      'El código que da miedo tocar es el que más necesita mejorar su diseño',
      'Un cambio que toca más de tres archivos es señal de acoplamiento alto',
      'Las interfaces son contratos — cambiarlas tiene un costo que hay que gestionar',
      'Diseñar para el cambio no es predecir el futuro, es mantener las opciones abiertas',
    ],
    codeExamples: [
      {
        lang: 'typescript', label: 'TypeScript',
        bad:
`// Agregar un nuevo método de envío requiere modificar esta función
function calculateShippingCost(method: string, weight: number): number {
  if (method === 'standard') return weight * 500
  if (method === 'express') return weight * 1200
  if (method === 'overnight') return weight * 2500
  // Cada nuevo método = editar código existente (viola Open/Closed)
  throw new Error('Método desconocido: ' + method)
}`,
        good:
`// Agregar un nuevo método = nueva clase, sin tocar lo existente
interface ShippingMethod {
  calculateCost(weightKg: number): number
  estimatedDays(): number
}

class StandardShipping implements ShippingMethod {
  calculateCost(weightKg: number) { return weightKg * 500 }
  estimatedDays() { return 5 }
}

class ExpressShipping implements ShippingMethod {
  calculateCost(weightKg: number) { return weightKg * 1200 }
  estimatedDays() { return 2 }
}

// Agregar DroneDelivery: nueva clase, cero cambios en código existente
class DroneDelivery implements ShippingMethod {
  calculateCost(weightKg: number) { return weightKg < 2 ? 990 : 1990 }
  estimatedDays() { return 0 }
}

function getShippingCost(method: ShippingMethod, weightKg: number) {
  return method.calculateCost(weightKg)
}`,
      },
      {
        lang: 'python', label: 'Python',
        bad:
`# Sin interfaces: NotificationService acoplado a implementaciones concretas
class OrderService:
    def complete_order(self, order):
        order.status = "completed"
        db.save(order)

        # Si queremos cambiar de Twilio a otro SMS: modificar OrderService
        twilio_client = TwilioClient(os.environ["TWILIO_KEY"])
        twilio_client.messages.create(to=order.phone, body="Orden lista!")

        # Si queremos agregar push notifications: modificar OrderService de nuevo
        fcm.send(order.device_token, "Orden lista!")`,
        good:
`# Con interfaces: OrderService no sabe cómo se implementa la notificación
from abc import ABC, abstractmethod

class NotificationChannel(ABC):
    @abstractmethod
    def notify(self, user_id: str, message: str): ...

class SmsNotification(NotificationChannel):
    def notify(self, user_id: str, message: str):
        twilio.send(get_phone(user_id), message)

class PushNotification(NotificationChannel):
    def notify(self, user_id: str, message: str):
        fcm.send(get_token(user_id), message)

class OrderService:
    def __init__(self, notifications: list[NotificationChannel]):
        self.notifications = notifications  # inyectado, no hardcodeado

    def complete_order(self, order):
        order.status = "completed"
        db.save(order)
        for channel in self.notifications:
            channel.notify(order.user_id, "Tu orden está lista!")

# Agregar EmailNotification: nueva clase, cero cambios en OrderService`,
      },
      {
        lang: 'java', label: 'Java',
        bad:
`// Sin inyección de dependencias: imposible de testear y de cambiar
public class ReportGenerator {
    public void generate(String reportType) {
        // Acoplado a implementaciones concretas
        MySQLDatabase db = new MySQLDatabase("jdbc:mysql://prod/db", "user", "pass");
        S3Storage storage = new S3Storage("prod-bucket");
        SendGridMailer mailer = new SendGridMailer(System.getenv("SENDGRID_KEY"));

        List<Row> data = db.query("SELECT * FROM sales WHERE type = ?", reportType);
        byte[] pdf = PdfGenerator.create(data);
        String url = storage.upload("report.pdf", pdf);
        mailer.send("team@company.com", "Reporte listo: " + url);
    }
}`,
        good:
`// Con inyección: cada dependencia es intercambiable sin tocar ReportGenerator
public class ReportGenerator {
    private final DataSource dataSource;
    private final FileStorage storage;
    private final Mailer mailer;

    public ReportGenerator(DataSource dataSource, FileStorage storage, Mailer mailer) {
        this.dataSource = dataSource;
        this.storage = storage;
        this.mailer = mailer;
    }

    public void generate(String reportType) {
        List<Row> data = dataSource.query(reportType);
        byte[] pdf = PdfGenerator.create(data);
        String url = storage.upload("report.pdf", pdf);
        mailer.send("team@company.com", "Reporte listo: " + url);
    }
}

// En tests: InMemoryDataSource, FakeStorage, SpyMailer
// En producción: MySQLDataSource, S3Storage, SendGridMailer`,
      },
    ],
  },
];
