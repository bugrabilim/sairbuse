import UIKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ application: UIApplication,
                     configurationForConnecting connectingSceneSession: UISceneSession,
                     options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        let config = UISceneConfiguration(name: "Default Configuration",
                                          sessionRole: connectingSceneSession.role)
        config.delegateClass = SceneDelegate.self
        return config
    }
}

/// Site çok sayfalı statik bir site: /siir/x/ adresi siir/x/index.html dosyasıdır. Capacitor'ın varsayılan
/// yönlendiricisi uzantısız her adresi ana sayfaya çevirir (tek sayfalık uygulamalar için); bu yönlendirici
/// dosyayı ya da klasörün index.html'ini bulur, ikisi de yoksa 404 sayfasını verir.
struct DizinYonlendirici: Router {
    var basePath: String = ""

    func route(for path: String) -> String {
        let dosyalar = FileManager.default
        let yol = basePath + path
        var klasor: ObjCBool = false
        if dosyalar.fileExists(atPath: yol, isDirectory: &klasor) {
            if !klasor.boolValue { return yol }
            let index = (yol as NSString).appendingPathComponent("index.html")
            if dosyalar.fileExists(atPath: index) { return index }
        }
        return basePath + "/404.html"
    }
}

/// Uygulamanın tek ekranı: Capacitor'ın web görünümü, sitenin klasör yapısını bilen yönlendiriciyle
class UygulamaViewController: CAPBridgeViewController {
    override func router() -> Router {
        return DizinYonlendirici()
    }
}
