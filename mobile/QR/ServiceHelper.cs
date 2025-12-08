public static class ServiceHelper
{
    public static T GetService<T>() =>
        Current.GetService<T>() ?? throw new Exception($"Unable to get service: {typeof(T)}");

    public static IServiceProvider Current =>
        IPlatformApplication.Current!.Services;
}
