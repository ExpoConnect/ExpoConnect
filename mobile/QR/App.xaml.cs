namespace QR
{
    public partial class App : Application
    {
        public static IServiceProvider Services { get; private set; }
        public App()
        {
            
            InitializeComponent();
            DecideStartupShell();
        }

        private async void DecideStartupShell()
        {
            var token = await SecureStorage.GetAsync("access_token");

            if (string.IsNullOrEmpty(token))
                MainPage = new GuestShell();  
            else
                MainPage = new AppShell();   
        }

        protected override Window CreateWindow(IActivationState? activationState)
        {
            // return new Window(new GuestShell());
            var tempPage = new ContentPage();
            return new Window(tempPage);
        }
    }
}