using UnityEngine;

public class BulletSpawner : MonoBehaviour {
    private GameManager gameManager;
    private Transform target;
    public GameObject[] bulletPrefab;

    private float spawnRate;
    private float timeAfterSpawn;
    public float RateMin = 0.5f;
    public float RateMax = 3f;





    void Start() {
        // 초기 스폰 간격 랜덤 설정 및 플레이어 타겟 저장
        timeAfterSpawn = 0f;
        spawnRate = Random.Range(RateMin, RateMax);
        target = GameObject.FindGameObjectWithTag("Player").transform;
        gameManager = FindFirstObjectByType<GameManager>();
    }

    void Update() {
        //⭐ null값||게임시작 않으면 게임시작이 안되므로 return 0;, 아래 스폰도
        if (gameManager == null || !gameManager.IsGameStarted)
            return;

        // 마지막 스폰 후 경과 시간 누적
        timeAfterSpawn += Time.deltaTime;

        // 스폰 간격에 도달하면 총알 생성
        if (timeAfterSpawn >= spawnRate) {
            timeAfterSpawn = 0f;

            // 랜덤하게 총알 종류 선택 후 생성
            int randomIndex = Random.Range(0, bulletPrefab.Length);
            GameObject bullet = Instantiate(bulletPrefab[randomIndex], transform.position, transform.rotation);

            // 총알을 플레이어 방향으로 회전 설정
            Vector3 targetPosition = target.position;
            targetPosition.y += 1.2f;
            bullet.transform.LookAt(targetPosition);

            spawnRate = Random.Range(RateMin, RateMax);
        }
    }
}
